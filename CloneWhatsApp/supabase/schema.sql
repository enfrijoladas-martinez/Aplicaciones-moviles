create table if not exists public.profiles (
    id uuid primary key references auth.users (id) on delete cascade,
    name text not null default '',
    email text,
    avatar_url text,
    last_seen timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create table if not exists public.devices (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles (id) on delete cascade,
    fcm_token text not null unique,
    platform text not null default 'android',
    updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    is_group boolean not null default false,
    name text,
    created_by uuid references public.profiles (id) on delete set null,
    created_at timestamptz not null default now()
);

create table if not exists public.conversation_members (
    conversation_id uuid not null references public.conversations (id) on delete cascade,
    user_id uuid not null references public.profiles (id) on delete cascade,
    joined_at timestamptz not null default now(),
    primary key (conversation_id, user_id)
);

create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations (id) on delete cascade,
    sender_id uuid not null references public.profiles (id) on delete cascade,
    content text not null default '',
    image_url text,
    status text not null default 'enviado' check (status in ('enviado', 'recibido', 'leido')),
    deleted boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists messages_conversacion_fecha on public.messages (conversation_id, created_at desc);
create index if not exists miembros_usuario on public.conversation_members (user_id);
create index if not exists dispositivos_usuario on public.devices (user_id);


create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, name, email)
    values (
        new.id,
        coalesce(nullif(new.raw_user_meta_data ->> 'name', ''), split_part(new.email, '@', 1)),
        new.email
    )
    on conflict (id) do nothing;
    return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
    after insert on auth.users
    for each row execute function public.crear_perfil();

insert into public.profiles (id, name, email)
select u.id,
       coalesce(nullif(u.raw_user_meta_data ->> 'name', ''), split_part(u.email, '@', 1)),
       u.email
from auth.users u
on conflict (id) do nothing;


create or replace function public.es_miembro(conv uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1
        from public.conversation_members
        where conversation_id = conv
          and user_id = auth.uid()
    );
$$;

create or replace function public.crear_conversacion_individual(otro uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    yo uuid := auth.uid();
    conv uuid;
begin
    if yo is null then
        raise exception 'Sin sesion';
    end if;

    if otro = yo then
        raise exception 'No puedes iniciar un chat contigo mismo';
    end if;

    if not exists (select 1 from public.profiles where id = otro) then
        raise exception 'El usuario no existe';
    end if;

    select c.id into conv
    from public.conversations c
    join public.conversation_members a on a.conversation_id = c.id and a.user_id = yo
    join public.conversation_members b on b.conversation_id = c.id and b.user_id = otro
    where not c.is_group
    limit 1;

    if conv is null then
        insert into public.conversations (is_group, created_by)
        values (false, yo)
        returning id into conv;

        insert into public.conversation_members (conversation_id, user_id)
        values (conv, yo), (conv, otro);
    end if;

    return conv;
end;
$$;

create or replace function public.crear_grupo(nombre text, miembros uuid[])
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    yo uuid := auth.uid();
    conv uuid;
begin
    if yo is null then
        raise exception 'Sin sesion';
    end if;

    if coalesce(trim(nombre), '') = '' then
        raise exception 'El grupo necesita nombre';
    end if;

    insert into public.conversations (is_group, name, created_by)
    values (true, trim(nombre), yo)
    returning id into conv;

    insert into public.conversation_members (conversation_id, user_id)
    select conv, p.id
    from public.profiles p
    where p.id = any (array_append(miembros, yo))
    on conflict do nothing;

    return conv;
end;
$$;

create or replace function public.mis_conversaciones()
returns table (
    id uuid,
    is_group boolean,
    titulo text,
    avatar_url text,
    otro_id uuid,
    ultimo_mensaje text,
    ultima_fecha timestamptz,
    ultimo_remitente uuid,
    ultimo_estado text,
    sin_leer integer
)
language sql
security definer
stable
set search_path = public
as $$
    select c.id,
           c.is_group,
           case when c.is_group then c.name else coalesce(nullif(o.name, ''), o.email) end,
           case when c.is_group then null else o.avatar_url end,
           case when c.is_group then null else o.id end,
           case
               when m.id is null then null
               when m.deleted then 'Mensaje eliminado'
               when m.image_url is not null and m.content = '' then 'Foto'
               when m.image_url is not null then 'Foto: ' || m.content
               else m.content
           end,
           m.created_at,
           m.sender_id,
           m.status,
           (
               select count(*)::integer
               from public.messages x
               where x.conversation_id = c.id
                 and x.sender_id <> auth.uid()
                 and x.status <> 'leido'
                 and not x.deleted
           )
    from public.conversation_members yo
    join public.conversations c on c.id = yo.conversation_id
    left join lateral (
        select p.*
        from public.conversation_members om
        join public.profiles p on p.id = om.user_id
        where om.conversation_id = c.id
          and om.user_id <> auth.uid()
        limit 1
    ) o on not c.is_group
    left join lateral (
        select mm.*
        from public.messages mm
        where mm.conversation_id = c.id
        order by mm.created_at desc
        limit 1
    ) m on true
    where yo.user_id = auth.uid()
    order by coalesce(m.created_at, c.created_at) desc;
$$;

create or replace function public.marcar_recibidos()
returns void
language sql
security definer
set search_path = public
as $$
    update public.messages m
    set status = 'recibido'
    where m.status = 'enviado'
      and m.sender_id <> auth.uid()
      and exists (
          select 1
          from public.conversation_members cm
          where cm.conversation_id = m.conversation_id
            and cm.user_id = auth.uid()
      );
$$;

create or replace function public.marcar_leidos(conv uuid)
returns void
language sql
security definer
set search_path = public
as $$
    update public.messages
    set status = 'leido'
    where conversation_id = conv
      and sender_id <> auth.uid()
      and status <> 'leido'
      and public.es_miembro(conv);
$$;

create or replace function public.tocar_conexion()
returns void
language sql
security definer
set search_path = public
as $$
    update public.profiles
    set last_seen = now()
    where id = auth.uid();
$$;

revoke execute on function public.es_miembro(uuid) from public, anon;
revoke execute on function public.crear_conversacion_individual(uuid) from public, anon;
revoke execute on function public.crear_grupo(text, uuid[]) from public, anon;
revoke execute on function public.mis_conversaciones() from public, anon;
revoke execute on function public.marcar_recibidos() from public, anon;
revoke execute on function public.marcar_leidos(uuid) from public, anon;
revoke execute on function public.tocar_conexion() from public, anon;

grant execute on function public.es_miembro(uuid) to authenticated;
grant execute on function public.crear_conversacion_individual(uuid) to authenticated;
grant execute on function public.crear_grupo(text, uuid[]) to authenticated;
grant execute on function public.mis_conversaciones() to authenticated;
grant execute on function public.marcar_recibidos() to authenticated;
grant execute on function public.marcar_leidos(uuid) to authenticated;
grant execute on function public.tocar_conexion() to authenticated;


alter table public.profiles enable row level security;
alter table public.devices enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;

drop policy if exists "perfiles visibles para usuarios" on public.profiles;
create policy "perfiles visibles para usuarios" on public.profiles
    for select to authenticated
    using (true);

drop policy if exists "cada quien edita su perfil" on public.profiles;
create policy "cada quien edita su perfil" on public.profiles
    for update to authenticated
    using (id = auth.uid())
    with check (id = auth.uid());

drop policy if exists "cada quien ve sus dispositivos" on public.devices;
create policy "cada quien ve sus dispositivos" on public.devices
    for select to authenticated
    using (user_id = auth.uid());

drop policy if exists "cada quien registra sus dispositivos" on public.devices;
create policy "cada quien registra sus dispositivos" on public.devices
    for insert to authenticated
    with check (user_id = auth.uid());

drop policy if exists "cada quien actualiza sus dispositivos" on public.devices;
create policy "cada quien actualiza sus dispositivos" on public.devices
    for update to authenticated
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

drop policy if exists "cada quien borra sus dispositivos" on public.devices;
create policy "cada quien borra sus dispositivos" on public.devices
    for delete to authenticated
    using (user_id = auth.uid());

drop policy if exists "miembros ven la conversacion" on public.conversations;
create policy "miembros ven la conversacion" on public.conversations
    for select to authenticated
    using (public.es_miembro(id));

drop policy if exists "miembros ven a los participantes" on public.conversation_members;
create policy "miembros ven a los participantes" on public.conversation_members
    for select to authenticated
    using (public.es_miembro(conversation_id));

drop policy if exists "miembros leen mensajes" on public.messages;
create policy "miembros leen mensajes" on public.messages
    for select to authenticated
    using (public.es_miembro(conversation_id));

drop policy if exists "miembros envian mensajes" on public.messages;
create policy "miembros envian mensajes" on public.messages
    for insert to authenticated
    with check (
        sender_id = auth.uid()
        and public.es_miembro(conversation_id)
        and status = 'enviado'
        and deleted = false
    );

drop policy if exists "autor elimina su mensaje" on public.messages;
create policy "autor elimina su mensaje" on public.messages
    for update to authenticated
    using (sender_id = auth.uid())
    with check (sender_id = auth.uid() and public.es_miembro(conversation_id));


do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
          and schemaname = 'public'
          and tablename = 'messages'
    ) then
        alter publication supabase_realtime add table public.messages;
    end if;
end;
$$;


insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true),
       ('chat-images', 'chat-images', true)
on conflict (id) do nothing;

drop policy if exists "subir foto de perfil propia" on storage.objects;
create policy "subir foto de perfil propia" on storage.objects
    for insert to authenticated
    with check (
        bucket_id = 'avatars'
        and (storage.foldername(name))[1] = auth.uid()::text
    );

drop policy if exists "subir imagenes a mis chats" on storage.objects;
create policy "subir imagenes a mis chats" on storage.objects
    for insert to authenticated
    with check (
        bucket_id = 'chat-images'
        and public.es_miembro(((storage.foldername(name))[1])::uuid)
    );
