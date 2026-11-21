create table if not exists public.profiles (
    id_profile uuid primary key references auth.users (id) on delete cascade,
    nombre varchar not null,
    apellido varchar not null,
    numero varchar unique,
    foto_perfil text,
    descripcion varchar,
    ultima_conexion timestamptz,
    escribiendo_en uuid,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.devices (
    id_device uuid primary key default gen_random_uuid(),
    id_profile uuid not null references public.profiles (id_profile) on delete cascade,
    nombre_dispositivo varchar,
    modelo varchar,
    plataforma varchar not null,
    token_push text,
    ultimo_acceso timestamptz,
    activo boolean not null default true,
    created_at timestamptz not null default now()
);

create table if not exists public.conversaciones (
    id_conversacion uuid primary key default gen_random_uuid(),
    tipo varchar not null default 'individual',
    nombre varchar,
    foto text,
    creada_por uuid references public.profiles (id_profile) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint tipo_valido check (tipo in ('individual', 'grupal'))
);

create table if not exists public.conversaciones_members (
    id_miembro uuid primary key default gen_random_uuid(),
    id_conversacion uuid not null references public.conversaciones (id_conversacion) on delete cascade,
    id_profile uuid not null references public.profiles (id_profile) on delete cascade,
    rol varchar not null default 'miembro',
    se_unio_en timestamptz not null default now(),
    ultimo_leido_en timestamptz,
    constraint rol_valido check (rol in ('miembro', 'admin')),
    constraint miembro_unico unique (id_conversacion, id_profile)
);

create table if not exists public.messages (
    id_message uuid primary key default gen_random_uuid(),
    id_conversacion uuid not null references public.conversaciones (id_conversacion) on delete cascade,
    id_remitente uuid not null references public.profiles (id_profile) on delete cascade,
    id_respuesta_a uuid references public.messages (id_message) on delete set null,
    contenido text,
    tipo varchar not null default 'texto',
    url_adjunto text,
    estado varchar not null default 'enviado',
    eliminado boolean not null default false,
    created_at timestamptz not null default now(),
    constraint tipo_mensaje_valido check (tipo in ('texto', 'imagen')),
    constraint estado_valido check (estado in ('enviado', 'recibido', 'leido'))
);


create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id_profile, nombre, apellido, numero)
    values (
        new.id,
        coalesce(nullif(new.raw_user_meta_data ->> 'nombre', ''), 'Sin nombre'),
        coalesce(nullif(new.raw_user_meta_data ->> 'apellido', ''), 'Sin apellido'),
        nullif(new.raw_user_meta_data ->> 'numero', '')
    )
    on conflict (id_profile) do nothing;

    return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
    after insert on auth.users
    for each row execute function public.crear_perfil();

create or replace function public.es_miembro(conversacion uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.conversaciones_members
        where id_conversacion = conversacion
          and id_profile = auth.uid()
    );
$$;

create or replace function public.abrir_conversacion(otro uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    yo uuid := auth.uid();
    encontrada uuid;
    nueva uuid;
begin
    if yo is null then
        raise exception 'No hay sesion';
    end if;

    if otro = yo then
        raise exception 'No puedes abrir una conversacion contigo mismo';
    end if;

    select c.id_conversacion
      into encontrada
      from public.conversaciones c
      join public.conversaciones_members a
        on a.id_conversacion = c.id_conversacion and a.id_profile = yo
      join public.conversaciones_members b
        on b.id_conversacion = c.id_conversacion and b.id_profile = otro
     where c.tipo = 'individual'
     limit 1;

    if encontrada is not null then
        return encontrada;
    end if;

    insert into public.conversaciones (tipo, creada_por)
    values ('individual', yo)
    returning id_conversacion into nueva;

    insert into public.conversaciones_members (id_conversacion, id_profile)
    values (nueva, yo), (nueva, otro);

    return nueva;
end;
$$;

create or replace function public.mis_chats()
returns table (
    id_conversacion uuid,
    tipo varchar,
    nombre_grupo varchar,
    foto_grupo text,
    otro_id uuid,
    otro_nombre varchar,
    otro_apellido varchar,
    otro_foto text,
    otro_ultima_conexion timestamptz,
    ultimo_mensaje text,
    ultimo_tipo varchar,
    ultimo_en timestamptz,
    ultimo_remitente uuid,
    no_leidos bigint
)
language sql
stable
security definer
set search_path = public
as $$
    select
        c.id_conversacion,
        c.tipo,
        c.nombre,
        c.foto,
        p.id_profile,
        p.nombre,
        p.apellido,
        p.foto_perfil,
        p.ultima_conexion,
        u.contenido,
        u.tipo,
        u.created_at,
        u.id_remitente,
        coalesce((
            select count(*)
            from public.messages m
            where m.id_conversacion = c.id_conversacion
              and m.id_remitente <> auth.uid()
              and m.eliminado = false
              and (mio.ultimo_leido_en is null or m.created_at > mio.ultimo_leido_en)
        ), 0)
    from public.conversaciones c
    join public.conversaciones_members mio
      on mio.id_conversacion = c.id_conversacion
     and mio.id_profile = auth.uid()
    left join lateral (
        select otros.id_profile
        from public.conversaciones_members otros
        where otros.id_conversacion = c.id_conversacion
          and otros.id_profile <> auth.uid()
        limit 1
    ) acompanante on c.tipo = 'individual'
    left join public.profiles p
      on p.id_profile = acompanante.id_profile
    left join lateral (
        select m.contenido, m.tipo, m.created_at, m.id_remitente
        from public.messages m
        where m.id_conversacion = c.id_conversacion
        order by m.created_at desc
        limit 1
    ) u on true
    order by coalesce(u.created_at, c.created_at) desc;
$$;

create or replace function public.crear_grupo(nombre_grupo text, miembros uuid[])
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    yo uuid := auth.uid();
    nueva uuid;
begin
    if yo is null then
        raise exception 'No hay sesion';
    end if;

    if coalesce(trim(nombre_grupo), '') = '' then
        raise exception 'El grupo necesita nombre';
    end if;

    insert into public.conversaciones (tipo, nombre, creada_por)
    values ('grupal', trim(nombre_grupo), yo)
    returning id_conversacion into nueva;

    insert into public.conversaciones_members (id_conversacion, id_profile, rol)
    values (nueva, yo, 'admin');

    insert into public.conversaciones_members (id_conversacion, id_profile, rol)
    select nueva, p.id_profile, 'miembro'
    from public.profiles p
    where p.id_profile = any (miembros)
      and p.id_profile <> yo
    on conflict (id_conversacion, id_profile) do nothing;

    return nueva;
end;
$$;

create or replace function public.marcar_recibidos()
returns void
language sql
security definer
set search_path = public
as $$
    update public.messages m
    set estado = 'recibido'
    where m.estado = 'enviado'
      and m.id_remitente <> auth.uid()
      and exists (
          select 1
          from public.conversaciones_members cm
          where cm.id_conversacion = m.id_conversacion
            and cm.id_profile = auth.uid()
      );
$$;

create or replace function public.marcar_leidos(conversacion uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    if not public.es_miembro(conversacion) then
        raise exception 'No perteneces a esta conversacion';
    end if;

    update public.messages
    set estado = 'leido'
    where id_conversacion = conversacion
      and id_remitente <> auth.uid()
      and estado <> 'leido';

    update public.conversaciones_members
    set ultimo_leido_en = now()
    where id_conversacion = conversacion
      and id_profile = auth.uid();
end;
$$;

create or replace function public.tocar_conexion()
returns void
language sql
security definer
set search_path = public
as $$
    update public.profiles
    set ultima_conexion = now()
    where id_profile = auth.uid();
$$;

revoke execute on function public.crear_perfil() from public, anon, authenticated;
revoke execute on function public.es_miembro(uuid) from public, anon;
revoke execute on function public.abrir_conversacion(uuid) from public, anon;
revoke execute on function public.mis_chats() from public, anon;
revoke execute on function public.crear_grupo(text, uuid[]) from public, anon;
revoke execute on function public.marcar_recibidos() from public, anon;
revoke execute on function public.marcar_leidos(uuid) from public, anon;
revoke execute on function public.tocar_conexion() from public, anon;

grant execute on function public.es_miembro(uuid) to authenticated;
grant execute on function public.abrir_conversacion(uuid) to authenticated;
grant execute on function public.mis_chats() to authenticated;
grant execute on function public.crear_grupo(text, uuid[]) to authenticated;
grant execute on function public.marcar_recibidos() to authenticated;
grant execute on function public.marcar_leidos(uuid) to authenticated;
grant execute on function public.tocar_conexion() to authenticated;


alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.conversaciones enable row level security;
alter table public.conversaciones_members enable row level security;
alter table public.messages enable row level security;

drop policy if exists "ver perfiles" on public.profiles;
create policy "ver perfiles" on public.profiles
    for select to authenticated using (true);

drop policy if exists "crear mi perfil" on public.profiles;
create policy "crear mi perfil" on public.profiles
    for insert to authenticated with check (id_profile = auth.uid());

drop policy if exists "editar mi perfil" on public.profiles;
create policy "editar mi perfil" on public.profiles
    for update to authenticated
    using (id_profile = auth.uid()) with check (id_profile = auth.uid());

drop policy if exists "ver mis dispositivos" on public.devices;
create policy "ver mis dispositivos" on public.devices
    for select to authenticated using (id_profile = auth.uid());

drop policy if exists "registrar mi dispositivo" on public.devices;
create policy "registrar mi dispositivo" on public.devices
    for insert to authenticated with check (id_profile = auth.uid());

drop policy if exists "actualizar mi dispositivo" on public.devices;
create policy "actualizar mi dispositivo" on public.devices
    for update to authenticated
    using (id_profile = auth.uid()) with check (id_profile = auth.uid());

drop policy if exists "borrar mi dispositivo" on public.devices;
create policy "borrar mi dispositivo" on public.devices
    for delete to authenticated using (id_profile = auth.uid());

drop policy if exists "ver mis conversaciones" on public.conversaciones;
create policy "ver mis conversaciones" on public.conversaciones
    for select to authenticated using (public.es_miembro(id_conversacion));

drop policy if exists "crear conversacion" on public.conversaciones;
create policy "crear conversacion" on public.conversaciones
    for insert to authenticated with check (creada_por = auth.uid());

drop policy if exists "actualizar mi conversacion" on public.conversaciones;
create policy "actualizar mi conversacion" on public.conversaciones
    for update to authenticated
    using (public.es_miembro(id_conversacion)) with check (public.es_miembro(id_conversacion));

drop policy if exists "ver miembros" on public.conversaciones_members;
create policy "ver miembros" on public.conversaciones_members
    for select to authenticated
    using (id_profile = auth.uid() or public.es_miembro(id_conversacion));

drop policy if exists "agregar miembros" on public.conversaciones_members;
create policy "agregar miembros" on public.conversaciones_members
    for insert to authenticated
    with check (id_profile = auth.uid() or public.es_miembro(id_conversacion));

drop policy if exists "actualizar mi membresia" on public.conversaciones_members;
create policy "actualizar mi membresia" on public.conversaciones_members
    for update to authenticated
    using (id_profile = auth.uid()) with check (id_profile = auth.uid());

drop policy if exists "salir de la conversacion" on public.conversaciones_members;
create policy "salir de la conversacion" on public.conversaciones_members
    for delete to authenticated using (id_profile = auth.uid());

drop policy if exists "ver mensajes" on public.messages;
create policy "ver mensajes" on public.messages
    for select to authenticated using (public.es_miembro(id_conversacion));

drop policy if exists "enviar mensajes" on public.messages;
create policy "enviar mensajes" on public.messages
    for insert to authenticated
    with check (id_remitente = auth.uid() and public.es_miembro(id_conversacion));

drop policy if exists "actualizar mensajes" on public.messages;
create policy "actualizar mensajes" on public.messages
    for update to authenticated
    using (public.es_miembro(id_conversacion)) with check (public.es_miembro(id_conversacion));


do $$
declare
    tabla text;
begin
    foreach tabla in array array['profiles', 'conversaciones_members', 'messages'] loop
        if not exists (
            select 1 from pg_publication_tables
            where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = tabla
        ) then
            execute format('alter publication supabase_realtime add table public.%I', tabla);
        end if;
    end loop;
end;
$$;


insert into storage.buckets (id, name, public)
values ('avatares', 'avatares', true),
       ('adjuntos', 'adjuntos', true)
on conflict (id) do nothing;

drop policy if exists "ver avatares" on storage.objects;
create policy "ver avatares" on storage.objects
    for select to public using (bucket_id = 'avatares');

drop policy if exists "subir mi avatar" on storage.objects;
create policy "subir mi avatar" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "reemplazar mi avatar" on storage.objects;
create policy "reemplazar mi avatar" on storage.objects
    for update to authenticated
    using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "borrar mi avatar" on storage.objects;
create policy "borrar mi avatar" on storage.objects
    for delete to authenticated
    using (bucket_id = 'avatares' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "ver adjuntos" on storage.objects;
create policy "ver adjuntos" on storage.objects
    for select to public using (bucket_id = 'adjuntos');

drop policy if exists "subir mis adjuntos" on storage.objects;
create policy "subir mis adjuntos" on storage.objects
    for insert to authenticated
    with check (bucket_id = 'adjuntos' and (storage.foldername(name))[1] = auth.uid()::text);
