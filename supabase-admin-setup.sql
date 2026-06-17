create table if not exists public.admin_users (
  email text primary key check (email = lower(email)),
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admins can read their own admin record" on public.admin_users;

create policy "Admins can read their own admin record"
on public.admin_users
for select
to authenticated
using (lower(email) = lower(auth.jwt() ->> 'email'));

insert into public.admin_users (email, role)
values
  ('duqueworks@gmail.com', 'admin'),
  ('eloi.calopa@gmail.com', 'admin'),
  ('mduquefernando@gmail.com', 'admin')
on conflict (email) do update set role = excluded.role;

create table if not exists public.admin_leads (
  id text primary key,
  cat text not null check (cat in ('Marca', 'Estudio')),
  brand text not null,
  handle text not null,
  theme text not null,
  contact_person text not null,
  contact_instagrams jsonb not null default '[]'::jsonb,
  followers integer,
  followers_label text not null default 'n/d',
  followers_sub text,
  country text not null,
  via text not null,
  is_email boolean not null default false,
  is_hot boolean not null default false,
  hit boolean not null default false,
  status text not null default 'pendiente' check (status in ('pendiente', 'hiteado', 'respondio', 'cerrado', 'descartado')),
  notes text not null default '',
  updated_at timestamptz not null default now(),
  updated_by text
);

alter table public.admin_leads enable row level security;

drop policy if exists "Admins can read leads" on public.admin_leads;
drop policy if exists "Admins can update leads" on public.admin_leads;

create policy "Admins can read leads"
on public.admin_leads
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

create policy "Admins can update leads"
on public.admin_leads
for update
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where lower(admin_users.email) = lower(auth.jwt() ->> 'email')
  )
);

insert into public.admin_leads (
  id, cat, brand, handle, theme, contact_person, contact_instagrams,
  followers, followers_label, followers_sub, country, via, is_email, is_hot
)
values
  ('huni', 'Marca', 'HUNI', 'huniworldwide', 'Streetwear futurista', 'Mona Thomas (fundadora)', '[{"handle":"mona_thomas"}]', 158000, '~158K', null, 'DE', 'mona@hunidesign.com', true, true),
  ('curves', 'Marca', 'Curves', 'curvesathome', 'Diseno / homeware', 'Sean Brown (fundador)', '[{"handle":"byseanbrown"}]', 106000, '~106K', null, 'CA', 'DM personal', false, false),
  ('hcw', 'Marca', 'Heaven Can Wait', '__heavencanwait__', 'Streetwear', 'Felix Spooner (fundador)', '[{"handle":"_felixspooner_"}]', 99000, '~99K', null, 'UK', 'DM personal / web', false, false),
  ('chew', 'Marca', 'Chew Forever', 'chew_forever', 'Streetwear', 'Martin Suder (cofundador)', '[{"handle":"suder.martin"},{"handle":"kfz_suder"}]', 79000, '~79K', 'marca / pers. n/d', 'CZ', 'DM', false, false),
  ('aoos', 'Marca', 'Always Out Of Stock', 'alwaysoutofstock', 'Streetwear', 'KING-MASA (fundador)', '[{"handle":"kingmasa2014"}]', 61000, '~61K', null, 'JP', 'Email web AOOS', false, false),
  ('ogbff', 'Marca', 'OGBFF', 'ogbff_', 'Graphic tees / internet', 'Lauren Schiller / Angela Ruis', '[{"handle":"schillllller"},{"handle":"bl0ndita"}]', 19000, '19K / 16K', 'marca ~48K', 'US', 'DM', false, false),
  ('parallelx', 'Marca', 'Parallel X Studio', 'parallelxstudio', 'Accesorios', 'Fundador no publico', '[]', 27000, '~27K', 'marca', 'UK', 'DM marca', false, false),
  ('nexusvii', 'Marca', 'NEXUS VII', 'nexusvii.official', 'Streetwear tecnico', 'Tomohiro Konno (disenador)', '[{"handle":"nexus7konno"}]', 22000, '~22K', null, 'JP', 'Email web nexusvii.jp', false, false),
  ('pierre', 'Marca', 'Pierre Bassene World', 'pierrebassene.world', 'Moda digital / CGI', 'Pierre Bassene (fundador)', '[{"handle":"pierrebassene.world","note":"la marca"}]', 20000, '~20K', null, 'CA', 'DM marca', false, true),
  ('finallayer', 'Marca', 'Final Layer', 'finallayer.berlin', 'Vintage / archive', 'Constantin Ungruhe (fundador)', '[{"handle":"constantinungruhe"}]', 18000, '~18K', 'marca / pers. n/d', 'DE', 'Web finallayer.eu', false, false),
  ('hidden', 'Marca', 'Hidden Characters', 'hidden_s_rank', 'Streetwear', 'Anonimo (Chicago)', '[{"handle":"the.wolf.hc","note":"soporte"}]', 15000, '~15K', 'marca', 'US', 'DM marca', false, false),
  ('dertbag', 'Marca', 'dertbag', 'dertbagus', 'Streetwear', 'Philip Post (atelier)', '[{"handle":"philiplpost"}]', 14000, '~14K', null, 'US', 'philip@dertbag.us', true, false),
  ('uuuntld', 'Marca', 'Uuuntld', 'uuuntld', 'Artist-led / streetwear', 'Randy Perez (fundador)', '[{"handle":"rvndyperez"}]', 13000, '~13K', null, 'US', 'contact@rvndyperez.com', true, false),
  ('aberizk', 'Marca', 'ABERIZK', 'shop_aberizk', 'Vintage / concept store', 'Allison Aberizk / Justin Xavier', '[]', 9000, '~9K', 'marca / LinkedIn', 'US', 'Web / LinkedIn', false, false),
  ('gumi', 'Marca', 'GUMI', 'gumi.eyewear', 'Eyewear / accesorios', 'Gurina Y. Chae (fundadora)', '[{"handle":"grrina"}]', 7800, '~7.8K', 'marca ~5.7K', 'US', 'Web gumiverse.com', false, false),
  ('ghetto', 'Marca', 'Ghetto Rodeo', 'ghetto.rodeo', 'Streetwear', 'Brian Saucedo (fundador)', '[{"handle":"ghetto.cowboyy"}]', null, 'n/d', null, 'US', 'DM personal', false, false),
  ('humandior', 'Marca', 'Human Dior', 'humandior.store', 'Vintage / archive resale', 'Jonathan Hinguanzo (owner)', '[{"handle":"jonjon.h_"}]', null, 'n/d', null, 'US', 'DM personal', false, false),
  ('everything', 'Marca', 'Everything Extraordinary', 'everythingextraordinary', 'Streetwear', 'Corbin Downen (owner)', '[{"handle":"cmdcorbin"}]', null, 'n/d', null, 'US', 'DM / LinkedIn', false, false),
  ('yuremane', 'Marca', 'Yuremane', 'yuremane', 'Vintage / denim', 'Nik (fundador)', '[]', 49000, '~49K', 'marca / pers. n/d', 'Global', 'DM / web', false, false),
  ('kamien', 'Marca', 'Kamien', 'kamien.kr', 'Workwear / streetwear', 'No publico (Busan)', '[]', null, 'n/d', null, 'KR', 'DM marca', false, false),
  ('gavin', 'Estudio', 'Gavin South', 'gilfgavin', 'Creador / edit', 'Gavin South', '[{"handle":"gilfgavin","note":"la cuenta"}]', 82000, '~82K', null, 'US', 'DM / colab', false, false),
  ('henry', 'Estudio', 'Henry', 'henry__irl', 'Fotografo / creador', 'Henry (= themanwhocapturedsunshine)', '[{"handle":"themanwhocapturedsunshine","note":"alt"}]', 27000, '~27K', null, 'Global', 'DM / colab', false, false),
  ('blulab', 'Estudio', 'blulab', 'blulab.inc', 'Estudio CGI', 'Fundador n/d', '[]', 15000, '~15K', 'cuenta', 'Global', 'DM colab', false, false),
  ('icestudios', 'Estudio', 'Ice Studios', 'icestudios.co', 'Agencia creativa', 'Renell Medrano & Jess Moloney', '[]', null, 'n/d', null, 'US / UK', 'Web icestudios.co - meterte como talento', false, false),
  ('typevarious', 'Estudio', 'typevarious', 'typevarious', 'Estudio diseno (sin verif.)', 'No identificado', '[]', null, 'n/d', null, 'Global', 'DM', false, false),
  ('isuperside', 'Estudio', 'isuperside', 'isuperside', 'Creativo (sin verif.)', 'No identificado', '[]', null, 'n/d', null, 'Global', 'DM', false, false),
  ('advisry', 'Marca', 'ADVISRY', 'advisry', 'Fashion autoral / cine', 'Keith Herron', '[{"handle":"yungrooftop"}]', 38000, '38K / 22K', 'personal / marca 22K', 'US', 'DM personal', false, false),
  ('ciriaco', 'Marca', 'CIRIACO', 'madebyciriaco', 'Accesorios futuristas', 'Ashley Ciriaco', '[{"handle":"ocairicyelhsa"}]', 70000, '70K / 18K', 'personal / marca 18K', 'US', 'DM personal', false, true),
  ('cheyennekimora', 'Marca', 'Cheyenne Kimora', 'cheyennekimora', 'Handmade / lujo objeto', 'Cheyenne Kimora', '[]', 20000, '~20K', 'marca', 'US', 'DM marca', false, false),
  ('beepybella', 'Marca', 'Beepy Bella', 'beepybella', 'Joyeria surreal / CGI', 'Isabella Lalonde', '[{"handle":"isabellalalonde"}]', 115000, '~115K', 'personal/marca - muy CGI', 'US', 'DM personal / marca', false, true),
  ('fangnyc', 'Marca', 'FANG NYC', 'fang.nyc', 'Knitwear queer', 'Fang Guo', '[{"handle":"fang.guo"}]', null, 'n/d', null, 'US', 'DM founder', false, false),
  ('tombogo', 'Marca', 'TOMBOGO', 'tombogo', 'Utility experimental', 'Tommy Bogo', '[{"handle":"tommybogo"}]', null, 'n/d', null, 'US', 'DM founder', false, false),
  ('muddpearl', 'Marca', 'Mudd Pearl', 'muddpearl', 'Joyeria organica / raw', 'Mary Anderson / Yasmin Moon', '[{"handle":"mariannederson"},{"handle":"yasminmoonmoon"}]', 21000, '~21K', 'marca - Euphoria-adjacent', 'US', 'DM marca / founders', false, false),
  ('cafeforgot', 'Marca', 'Cafe Forgot', 'cafe_forgot', 'Concept store / curaduria', 'Vita Haas / Lucy Weisner', '[]', 95000, '~95K', 'marca - red de disenadores', 'US', 'info@cafeforgot.com', true, false),
  ('sc103', 'Marca', 'SC103', 'sc103_official', 'Art-world / handmade', 'Claire McKinney / Sophie Andes-Gascon', '[]', 38000, '~38K', 'marca', 'US', 'DM marca', false, false),
  ('gauntlettcheng', 'Marca', 'Gauntlett Cheng', 'gauntlettcheng', 'Downtown NY / emocional', 'Esther Gauntlett / Jenny Cheng', '[]', 26000, '~26K', 'marca', 'US', 'DM marca', false, false),
  ('jamesveloria', 'Marca', 'James Veloria', 'jamesveloria', 'Vintage / archive', 'Collin James / Brandon Veloria', '[]', 39000, '~39K', 'marca - comunidad fuerte', 'US', 'DM marca', false, false),
  ('colbo', 'Marca', 'Colbo', 'colbo.nyc', 'Concept store', 'Tal Silberstein', '[]', 56000, '~56K', 'tienda', 'US', 'DM / tienda', false, false),
  ('meals', 'Marca', 'Meals Clothing', 'meals.clothing', 'Humor conceptual', 'Sam Salad / Rebma', '[]', 28000, '~28K', 'marca - food-fashion', 'US', 'DM marca', false, false),
  ('poliquant', 'Marca', 'POLIQUANT', 'poliquant', 'Techwear / funcion', 'Junichi Sugita', '[]', 16000, '~16K', 'marca - Tokyo', 'JP', 'DM marca', false, false),
  ('cyderboy', 'Marca', 'CYDERBOY / CYDERHOUSE', 'cyderboy', 'Handmade revamp', 'Yuji Okamoto', '[{"handle":"ug_okamoto"}]', 7300, '~7.3K', 'personal - Ura-Hara', 'JP', 'DM personal', false, false),
  ('pronounce', 'Marca', 'PRONOUNCE', '_pronounce', 'Sastreria autoral', 'Yushan Li / Jun Zhou', '[]', 39000, '~39K', 'marca - identidad asiatica', 'CN / UK', 'DM marca', false, false),
  ('commission', 'Marca', 'Commission', 'commissionofficial', 'Sastreria / nostalgia', 'Dylan Cao / Jin Kay', '[]', 76000, '~76K', 'marca - nostalgia asiatica', 'US', 'DM marca', false, false),
  ('loudallas', 'Marca', 'Lou Dallas', 'lou_dallas', 'Fantasy / upcycling', 'Raffaella Hanley', '[]', 14000, '~14K', 'marca - Euphoria-adjacent', 'US', 'DM marca', false, false),
  ('marlandbackus', 'Marca', 'Marland Backus', 'marlandbackus', 'Joyeria industrial / surreal', 'Marland Backus', '[{"handle":"marzipanjupiter"}]', 33000, '33K / 5K', 'personal / marca 5K', 'US / JP', 'info@marlandbackus.com', true, false),
  ('runnybabbit', 'Marca', 'Runny Babbit', 'runny___babbit', 'Handmade escultural', 'Disenador n/d', '[]', 1900, '~1.9K', 'muy pequeno - Cafe Forgot world', 'US', 'DM marca', false, false)
on conflict (id) do update set
  cat = excluded.cat,
  brand = excluded.brand,
  handle = excluded.handle,
  theme = excluded.theme,
  contact_person = excluded.contact_person,
  contact_instagrams = excluded.contact_instagrams,
  followers = excluded.followers,
  followers_label = excluded.followers_label,
  followers_sub = excluded.followers_sub,
  country = excluded.country,
  via = excluded.via,
  is_email = excluded.is_email,
  is_hot = excluded.is_hot;
