create extension if not exists pg_net with schema extensions;

create or replace function public.registrar_dispositivo(token text, nombre text, modelo_equipo text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    yo uuid := auth.uid();
begin
    if yo is null then
        raise exception 'No hay sesion';
    end if;

    if coalesce(trim(token), '') = '' then
        raise exception 'Token vacio';
    end if;

    delete from public.devices
    where token_push = token
      and id_profile <> yo;

    update public.devices
    set activo = true,
        ultimo_acceso = now(),
        nombre_dispositivo = nombre,
        modelo = modelo_equipo
    where token_push = token
      and id_profile = yo;

    if not found then
        insert into public.devices (id_profile, nombre_dispositivo, modelo, plataforma, token_push, ultimo_acceso, activo)
        values (yo, nombre, modelo_equipo, 'android', token, now(), true);
    end if;
end;
$$;

create or replace function public.quitar_dispositivo(token text)
returns void
language sql
security definer
set search_path = public
as $$
    update public.devices
    set activo = false
    where token_push = token
      and id_profile = auth.uid();
$$;

revoke execute on function public.registrar_dispositivo(text, text, text) from public, anon;
revoke execute on function public.quitar_dispositivo(text) from public, anon;
grant execute on function public.registrar_dispositivo(text, text, text) to authenticated;
grant execute on function public.quitar_dispositivo(text) to authenticated;

do $$
begin
    if not exists (select 1 from vault.secrets where name = 'webhook_mensajes') then
        perform vault.create_secret(
            encode(extensions.gen_random_bytes(32), 'hex'),
            'webhook_mensajes',
            'Firma las llamadas del trigger de messages a la Edge Function notificar-mensaje'
        );
    end if;
end;
$$;

create or replace function public.secreto_webhook()
returns text
language sql
security definer
stable
set search_path = public
as $$
    select decrypted_secret from vault.decrypted_secrets where name = 'webhook_mensajes';
$$;

revoke execute on function public.secreto_webhook() from public, anon, authenticated;
grant execute on function public.secreto_webhook() to service_role;

create or replace function public.avisar_mensaje_nuevo()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    perform net.http_post(
        url := 'https://ypclpjtjhiirunieakuu.supabase.co/functions/v1/notificar-mensaje',
        body := jsonb_build_object('id_message', new.id_message),
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-webhook-secret', public.secreto_webhook()
        ),
        timeout_milliseconds := 5000
    );
    return new;
end;
$$;

revoke execute on function public.avisar_mensaje_nuevo() from public, anon, authenticated;

drop trigger if exists al_insertar_mensaje on public.messages;
create trigger al_insertar_mensaje
    after insert on public.messages
    for each row execute function public.avisar_mensaje_nuevo();
