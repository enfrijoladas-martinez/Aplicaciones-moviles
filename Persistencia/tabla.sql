create table if not exists public.productos (
  id bigint generated always as identity primary key,
  producto text not null,
  descripcion text,
  precio numeric(10, 2) not null default 0,
  creado_en timestamptz not null default now()
);

alter table public.productos enable row level security;

drop policy if exists "lectura publica" on public.productos;
drop policy if exists "insertar publico" on public.productos;
drop policy if exists "actualizar publico" on public.productos;
drop policy if exists "borrar publico" on public.productos;

create policy "lectura publica"
  on public.productos for select
  to anon
  using (true);

create policy "insertar publico"
  on public.productos for insert
  to anon
  with check (true);

create policy "actualizar publico"
  on public.productos for update
  to anon
  using (true)
  with check (true);

create policy "borrar publico"
  on public.productos for delete
  to anon
  using (true);
