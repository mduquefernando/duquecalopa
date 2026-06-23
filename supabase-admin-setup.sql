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
drop policy if exists "Admins can insert leads" on public.admin_leads;
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

create policy "Admins can insert leads"
on public.admin_leads
for insert
to authenticated
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
  ('runnybabbit', 'Marca', 'Runny Babbit', 'runny___babbit', 'Handmade escultural', 'Disenador n/d', '[]', 1900, '~1.9K', 'muy pequeno - Cafe Forgot world', 'US', 'DM marca', false, false),
  ('marshalcrews', 'Estudio', 'Marsh / Marshal Crews', 'marshalcrews', 'Creador / espacio', 'Marsh', '[]', 367787, '~368K', null, 'US', 'DM', false, false),
  ('outofcore', 'Marca', 'Out of Core', 'out.of.core', 'Eyewear', 'n/d', '[]', 12940, '~12.9K', null, 'Global', 'DM marca', false, false),
  ('ravemoreberlin', 'Estudio', 'Ravemore Berlin', 'ravemoreberlin', 'Rave / eventos', 'n/d', '[]', 101318, '~101K', null, 'DE', 'DM', false, false),
  ('sume78', 'Marca', 'Sume Apparel', 'sume.78', 'Streetwear / apparel', 'n/d', '[]', 70900, '~71K', null, 'US', 'team@sumeapparel.com', true, false),
  ('aesirstudios', 'Marca', 'Aesir Studios', 'aesir.studios', 'Designer brand', 'n/d (germano-vietnamita)', '[]', 81855, '~82K', null, 'DE', 'DM marca', false, false),
  ('peoplesense', 'Marca', 'Peoplesense', '_peoplesense_', 'Raw denim', 'n/d', '[]', 75378, '~75K', 'peoplestyle.shop', 'Global', 'Web peoplestyle.shop', false, false),
  ('repartostudio', 'Estudio', 'Reparto Studio', 'repartostudio', 'Estudio creativo / personajes', 'n/d', '[]', 16968, '~17K', null, 'Global', 'agency@lobby.pr', true, false),
  ('crvdae', 'Marca', 'CRVDAE', 'crvdae', 'Denim / fashion', 'n/d', '[]', 101621, '~102K', null, 'Global', 'info@crvdae.com', true, false),
  ('belvet', 'Marca', 'BELVET', 'belvet.jp', 'Workwear (JP)', 'n/d', '[]', 99436, '~99K', null, 'JP', 'DM / online store', false, false)
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

insert into public.admin_leads (
  id, cat, brand, handle, theme, contact_person, contact_instagrams,
  followers, followers_label, followers_sub, country, via, is_email, is_hot, notes
)
values
  ('suspiciousantwerp', 'Marca', 'Suspicious Antwerp', 'suspiciousantwerp', 'European streetwear / retail', 'Support / brand team', '[{"handle":"suspiciousantwerp"}]', 479000, '479K', 'marca', 'BE / EU', 'info@suspiciousantwerp.com / web / DM', true, true, 'Origen batch jun 2026. Score 94. Fuente: https://www.instagram.com/p/DZ453pDMT0D/ Evidencia: Post 2026-06-22: 2.6K likes. Web oficial y customer service activos; tiendas en BE/NL. Angulo: Marca grande con retail y drops. Propuesta premium: CGI de prenda, retail screen content y short-form edits.'),
  ('ditch', 'Marca', 'DITCH', 'ditch', 'Streetwear drops / zipups', 'Equipo DITCH', '[{"handle":"ditch"}]', 180000, '180K', 'marca', 'US', 'contact@ditch.la / Discord / DM', true, true, 'Origen batch jun 2026. Score 94. Fuente: https://www.instagram.com/p/DZ29Z4wGjCD/ Evidencia: Post 2026-06-21: RUIN ZIPUPS premade 6/27; only account, Discord y free US shipping. Angulo: Lead grande con calendario de drop claro. 3 assets para lanzamiento: teaser, product loop y paid social edit.'),
  ('moremoneymorelove', 'Marca', 'MORE MONEY MORE LOVE', 'moremoneymorelove.de', 'German streetwear / summer drop', 'Support / Mert Mehmet Bulut', '[{"handle":"moremoneymorelove.de"}]', 171000, '171K', 'marca', 'DE', 'support@moremoneymorelove.de / web / DM', true, true, 'Origen batch jun 2026. Score 93. Fuente: https://www.instagram.com/reel/DZNcjfDMOdv/ Evidencia: Reel 2026-06-05: summer collection, 4.9K likes, 393 comments. Imprint con email y direccion en Dusseldorf. Angulo: Engagement fuerte y calendario de coleccion. Teaser para drop, CGI de denim/fleece y pack de reels para ads.'),
  ('rtabrand', 'Marca', 'RTA / Road To Awe', 'rtabrand', 'Luxury streetwear / denim / eyewear', 'Equipo RTA / Wholesale', '[{"handle":"rtabrand"}]', 143000, '143K', 'marca', 'US', 'wholesale@rtabrand.com / shop@rtabrand.com / DM', true, true, 'Origen batch jun 2026. Score 91. Fuente: https://www.instagram.com/reel/DY0K4NwRjhw/ Evidencia: Reel 2026-05-26: PF26 D2 coming soon. Web lista wholesale, shop y career emails. Angulo: Marca establecida; entrar por wholesale/marketing con mock premium: eyewear distortion, denim CGI o PF26 teaser.'),
  ('belacartes', 'Marca', 'Belacartes', 'belacartess', 'Handmade garments / footwear', 'Equipo Belacartes / Collaborations', '[{"handle":"belacartess"}]', 75000, '75K', 'marca', 'US', 'trent@belacartes.com / contact@belacartes.com / DM', true, true, 'Origen batch jun 2026. Score 88. Fuente: https://www.instagram.com/p/DZ5bXaHGgjK/ Evidencia: Post 2026-06-22: SLUG BOOT Blood Edition, 10 pairs only. Contact page con email de colaboraciones. Angulo: Buen fit para CGI de producto limited. Boot render, gritty reveal, launch countdown y assets para social.'),
  ('misfitmania', 'Marca', 'Misfit Mania', '_misfitmania', 'Shorts / youth streetwear', 'Equipo Misfit Mania', '[{"handle":"_misfitmania"}]', 51000, '51K', 'marca', 'US / Global', 'misfitmania.com / VIP signup / DM', false, false, 'Origen batch jun 2026. Score 81. Fuente: https://www.instagram.com/reel/DYSSDJhhzTo/ Evidencia: Reel 2026-05-13: Slanted Hoop shorts, 1.4K likes. Web activa y signup VIP/restock. Angulo: Producto simple y vendible. Mini pack de launch visuals: try-on, motion graphics y social ads.'),
  ('snoresco', 'Marca', 'snores', 'snoresco', 'Streetwear / graphic tees', 'Equipo SNORES', '[{"handle":"snoresco"}]', 39000, '39K', 'marca', 'FR / EU', 'snoresco.com / DM', false, true, 'Origen batch jun 2026. Score 84. Fuente: https://www.instagram.com/reel/DXcLryBDBjz/ Evidencia: Reel 2026-04-22: GET READY, 3.1K likes. Trustpilot lista snoresco.com en Francia. Angulo: Marca joven con buen ratio. Visuales de countdown/drop y edits de producto para IG.'),
  ('viracocha', 'Marca', '*VIRACOCHA', 'viracocha.uk', 'Denim / selvedge / UK streetwear', 'Equipo VIRACOCHA', '[{"handle":"viracocha.uk"}]', 24000, '24K', 'marca', 'UK', 'DM marca / checkout web', false, true, 'Origen batch jun 2026. Score 82. Fuente: https://www.instagram.com/p/DZpJ1gmg5iy/ Evidencia: Post 2026-06-16: Trinity Tiger 14oz Japanese Selvedge Denim. Angulo: Producto visual y drop limitado. Video macro denim, fit CGI, packshot animado o campana para nuevo drop.'),
  ('toofar', 'Marca', 'toofar', 'toofar.us', 'Denim / archive fashion', 'Equipo toofar', '[{"handle":"toofar.us"}]', 19000, '19K', 'marca', 'US', 'toofar.us/contact / DM', false, true, 'Origen batch jun 2026. Score 84. Fuente: https://www.instagram.com/reel/DWx0FQBkRQm/ Evidencia: Reel 2026-04-05: 16K likes para carbon headquarters denim; web con seccion CONTACT. Angulo: Engagement altisimo para su tamano. Visuales para denim: fit guide animado, closeups de textura y teaser de drop.'),
  ('inspire4l', 'Marca', 'Inspire', 'inspire.4l', 'Waxed denim / alt fashion', 'Owner @lewckiie / team', '[{"handle":"inspire.4l"},{"handle":"lewckiie"}]', 18000, '18K', 'marca', 'EU / Global', 'inspire4l.com / DM owner', false, true, 'Origen batch jun 2026. Score 80. Fuente: https://www.instagram.com/reel/DYKvN8qNSEg/ Evidencia: Reel 2026-05-10: 35K likes. Owner @lewckiie, site open, worldwide shipping. Angulo: Viralidad muy alta para 18K. DM al owner para convertir ese pico en drop campaign: denim closeups y cinematic fit reels.'),
  ('marcosqrd', 'Marca', 'Marco SQRD', 'marco.sqrd', 'Archive luxury / showroom / styling', 'Marco SQRD showroom', '[{"handle":"marco.sqrd"}]', 12000, '12K', 'showroom', 'US', 'sqrd.marco@gmail.com / DM / showroom', true, false, 'Origen batch jun 2026. Score 78. Cat original: Tienda. Fuente: https://www.instagram.com/reel/DXPGzCUkVgt/ Evidencia: Reel 2026-04-17: Balenciaga Venom boots, 9.9K likes. Web con styling service y email. Angulo: Mas showroom/servicio que marca propia. Contenido para piezas raras: reels de archivo, styling film y CGI/object scans.'),
  ('drkpassengers', 'Marca', 'Dark Passengers', 'drkpassengers', 'Dark streetwear / moto hoodie', 'Equipo Dark Passengers', '[{"handle":"drkpassengers"}]', 10000, '10K', 'marca', 'US', 'darkpassengers.co / DM', false, false, 'Origen batch jun 2026. Score 72. Fuente: https://www.instagram.com/reel/DYqmBnIsixo/ Evidencia: Reel 2026-05-22: 565 likes. Shopify activa con moto hoodie y track jacket. Angulo: Marca pequena con estetica clara. 2 reels de producto oscuro, lighting dramatico y edit rapido para drop.'),
  ('gabrielankar', 'Estudio', 'Gabriel Ankar', 'gabriel_ankar', 'Creative direction / CGI / fashion object', 'Gabriel Ankar', '[{"handle":"gabriel_ankar"}]', 10000, '10K', 'creative direction + CGI Paris', 'FR / EU', 'DM personal', false, false, 'Origen batch jun 2026. Score 70. Cat original: Creador. Fuente: https://www.instagram.com/reel/DYPsy5IsZZN/ Evidencia: Reel 2026-05-12: production/shipping update. Perfil: Creative Direction + CGI Paris. Angulo: Mas colaborador que cliente. Apoyo de CGI/edit para sus drops, making-of o colaboracion fashion film.'),
  ('floriacharchives', 'Marca', 'FLORIACH ARCHIVES', 'floriacharchives', 'Archive-inspired garments / Shopify', 'Equipo Floriach Archives', '[{"handle":"floriacharchives"}]', 14000, '14K', 'marca', 'EU / Global', 'floriacharchives.com / Shop / DM', false, false, 'Origen batch jun 2026. Score 69. Fuente: https://www.instagram.com/reel/DZ4avdTtdEJ/ Evidencia: Reel 2026-06-22: last units online. Worldwide shipping; Shop app con tienda y reviews. Angulo: Marca pequena con stock activo. Visuales rapidos para last units/restock: product loops y edits de catalogo.'),
  ('metapoint', 'Estudio', 'Metapoint', 'metapoint.xyz', 'CGI / 3D artist / covers', 'Alex / Metapoint', '[{"handle":"metapoint.xyz"},{"handle":"jonasunden"}]', 9535, '9.5K', '3D artist, Prague', 'CZ / EU', 'DM / metapoint.xyz', false, false, 'Origen batch jun 2026. Score 76. Fuente: https://www.instagram.com/p/DZbO1bQiAYh/ Evidencia: Post 2026-06-10: covers para @ikkimel42; CGI @metapoint.xyz, foto/CD @jonasunden. Angulo: Posible colaborador/estudio hermano. Overflow de CGI, compositing, IA/video o colaboracion music/fashion.'),
  ('meyoni', 'Marca', 'meyoni', 'meyoni.co', 'Low-rise denim / alt womenswear', 'Equipo Meyoni', '[{"handle":"meyoni.co"}]', 9334, '9.3K', 'marca', 'US / Global', 'SMS (877) 352-8290 / DM', false, false, 'Origen batch jun 2026. Score 67. Fuente: https://www.instagram.com/reel/DZ5TfyyoWJb/ Evidencia: Reel 2026-06-22: low-rise denim, SMS early access. Perfil lista numero SMS. Angulo: Buen fit de producto para denim. DM corto: assets para 4th of July/drop, fit reels y detalle de costuras.'),
  ('emmaeickhout', 'Estudio', 'Emma Eickhout', 'buiitenaardswezen', 'Graphic design / poster / typography', 'Emma Eickhout', '[{"handle":"buiitenaardswezen"}]', 6325, '6.3K', 'open for commissions', 'NL', 'eeickhout@gmail.com / DM', true, false, 'Origen batch jun 2026. Score 70. Cat original: Creador. Fuente: https://www.instagram.com/reel/DZAgbhaI-77/ Evidencia: Reel 2026-05-31: 5.8K likes. Perfil: open for commissions y email. Angulo: Colaboradora visual fuerte. Intercambio/colab para posters animados, typography loops o pitch decks.'),
  ('emfo', 'Marca', 'EMFO', '_emfo_', 'Arte wearable / audiovisual', 'EMFO + Esteban Azuela + LINEA 2', '[{"handle":"_emfo_"},{"handle":"esesteban"},{"handle":"linea2.mx"}]', 5245, '5.2K', 'EMFO; LINEA 2 4.1K', 'MX', 'DM equipo / LINEA 2', false, false, 'Origen batch jun 2026. Score 72. Fuente: https://www.instagram.com/reel/DZ1fnoioi6o/ Evidencia: Reel 2026-06-20: ''Caverna''. Visual @esesteban @linea2.mx; Audio @_emfo_. Angulo: Lenguaje conceptual y audiovisual. Pieza onirica/CGI para lanzamiento o visualizer.'),
  ('mineralarchive', 'Marca', 'Mineral Archive', 'mineralarchiveshop', 'Graphic tees / underground fashion', 'Equipo Mineral Archive', '[{"handle":"mineralarchiveshop"}]', 723, '723', 'marca nueva', 'UK', 'mineralarchiveshop.com / DM', false, false, 'Origen batch jun 2026. Score 66. Fuente: https://www.instagram.com/reel/DZ2zmpHIBej/ Evidencia: Reel 2026-06-21: heavy weight vintage wash shirts. Shopify activa con newsletter. Angulo: Marca pequena con post de ratio alto. Paquete entry: 3 reels de producto, mockups y visuales para drop.'),
  ('bymyonn', 'Marca', 'My''on', 'bymyonn', 'Niche streetwear / tees', 'Equipo My''on / Nylan Cannon (creativo)', '[{"handle":"bymyonn"},{"handle":"nylancannonn"}]', 351, '351', 'marca emergente', 'US', 'DM marca', false, false, 'Origen batch jun 2026. Score 64. Fuente: https://www.instagram.com/reel/DZ3tzexOIrc/ Evidencia: Reel 2026-06-21: 1.6K likes, tees drop next month, link in bio. Angulo: Cuenta pequena con viralidad puntual. DM tactico: visuales rapidos para el drop del mes que viene.')
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
  is_hot = excluded.is_hot,
  notes = excluded.notes;
