import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./supabase-config.js";

const configPanel = document.getElementById("configPanel");
const loginPanel = document.getElementById("loginPanel");
const deniedPanel = document.getElementById("deniedPanel");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");
const sessionLabel = document.getElementById("sessionLabel");
const roleLabel = document.getElementById("roleLabel");
const welcomeBanner = document.getElementById("welcomeBanner");
const crmMessage = document.getElementById("crmMessage");
const tbody = document.getElementById("tbody");
const temaSel = document.getElementById("temaSel");
const sortSel = document.getElementById("sortSel");
const statusSel = document.getElementById("statusSel");
const searchInput = document.getElementById("search");
const groupBtn = document.getElementById("groupBtn");
const resetBtn = document.getElementById("resetBtn");
const catPills = document.getElementById("catPills");

const panels = [configPanel, loginPanel, deniedPanel, adminPanel];
const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  SUPABASE_URL.includes(".supabase.co") &&
  !SUPABASE_URL.includes("YOUR_PROJECT_REF") &&
  SUPABASE_ANON_KEY.length > 40 &&
  !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY");

const SESSION_KEY = "viral_admin_session_v2";
const LEGACY_SESSION_KEYS = ["viral_admin_session"];
const STATIC_LEAD_STATE_KEY = "viral_admin_static_leads_v1";
const SHARED_REFRESH_MS = 15000;
const CRM_IMPORT_SOURCES = [
  { url: "korea-contacts-jun2026.html", country: "KR", origin: "Korea creative contacts jun 2026" },
  { url: "uk-contacts-jun2026.html", country: "UK", origin: "UK creative contacts jun 2026" },
  { url: "viral-crm-prospects.html", origin: "Viral prospects CRM pull 01", type: "table" }
];
const EXTRA_LEADS = [
  { id: "advisry", cat: "Marca", brand: "ADVISRY", handle: "advisry", theme: "Fashion autoral / cine", contact_person: "Keith Herron", contact_instagrams: [{ handle: "yungrooftop" }], followers: 38000, followers_label: "38K / 22K", followers_sub: "personal / marca 22K", country: "US", via: "DM personal", is_email: false, is_hot: false },
  { id: "ciriaco", cat: "Marca", brand: "CIRIACO", handle: "madebyciriaco", theme: "Accesorios futuristas", contact_person: "Ashley Ciriaco", contact_instagrams: [{ handle: "ocairicyelhsa" }], followers: 70000, followers_label: "70K / 18K", followers_sub: "personal / marca 18K", country: "US", via: "DM personal", is_email: false, is_hot: true },
  { id: "cheyennekimora", cat: "Marca", brand: "Cheyenne Kimora", handle: "cheyennekimora", theme: "Handmade / lujo objeto", contact_person: "Cheyenne Kimora", contact_instagrams: [], followers: 20000, followers_label: "~20K", followers_sub: "marca", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "beepybella", cat: "Marca", brand: "Beepy Bella", handle: "beepybella", theme: "Joyeria surreal / CGI", contact_person: "Isabella Lalonde", contact_instagrams: [{ handle: "isabellalalonde" }], followers: 115000, followers_label: "~115K", followers_sub: "personal/marca - muy CGI", country: "US", via: "DM personal / marca", is_email: false, is_hot: true },
  { id: "fangnyc", cat: "Marca", brand: "FANG NYC", handle: "fang.nyc", theme: "Knitwear queer", contact_person: "Fang Guo", contact_instagrams: [{ handle: "fang.guo" }], followers: null, followers_label: "n/d", followers_sub: null, country: "US", via: "DM founder", is_email: false, is_hot: false },
  { id: "tombogo", cat: "Marca", brand: "TOMBOGO", handle: "tombogo", theme: "Utility experimental", contact_person: "Tommy Bogo", contact_instagrams: [{ handle: "tommybogo" }], followers: null, followers_label: "n/d", followers_sub: null, country: "US", via: "DM founder", is_email: false, is_hot: false },
  { id: "muddpearl", cat: "Marca", brand: "Mudd Pearl", handle: "muddpearl", theme: "Joyeria organica / raw", contact_person: "Mary Anderson / Yasmin Moon", contact_instagrams: [{ handle: "mariannederson" }, { handle: "yasminmoonmoon" }], followers: 21000, followers_label: "~21K", followers_sub: "marca - Euphoria-adjacent", country: "US", via: "DM marca / founders", is_email: false, is_hot: false },
  { id: "cafeforgot", cat: "Marca", brand: "Cafe Forgot", handle: "cafe_forgot", theme: "Concept store / curaduria", contact_person: "Vita Haas / Lucy Weisner", contact_instagrams: [], followers: 95000, followers_label: "~95K", followers_sub: "marca - red de disenadores", country: "US", via: "info@cafeforgot.com", is_email: true, is_hot: false },
  { id: "sc103", cat: "Marca", brand: "SC103", handle: "sc103_official", theme: "Art-world / handmade", contact_person: "Claire McKinney / Sophie Andes-Gascon", contact_instagrams: [], followers: 38000, followers_label: "~38K", followers_sub: "marca", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "gauntlettcheng", cat: "Marca", brand: "Gauntlett Cheng", handle: "gauntlettcheng", theme: "Downtown NY / emocional", contact_person: "Esther Gauntlett / Jenny Cheng", contact_instagrams: [], followers: 26000, followers_label: "~26K", followers_sub: "marca", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "jamesveloria", cat: "Marca", brand: "James Veloria", handle: "jamesveloria", theme: "Vintage / archive", contact_person: "Collin James / Brandon Veloria", contact_instagrams: [], followers: 39000, followers_label: "~39K", followers_sub: "marca - comunidad fuerte", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "colbo", cat: "Marca", brand: "Colbo", handle: "colbo.nyc", theme: "Concept store", contact_person: "Tal Silberstein", contact_instagrams: [], followers: 56000, followers_label: "~56K", followers_sub: "tienda", country: "US", via: "DM / tienda", is_email: false, is_hot: false },
  { id: "meals", cat: "Marca", brand: "Meals Clothing", handle: "meals.clothing", theme: "Humor conceptual", contact_person: "Sam Salad / Rebma", contact_instagrams: [], followers: 28000, followers_label: "~28K", followers_sub: "marca - food-fashion", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "poliquant", cat: "Marca", brand: "POLIQUANT", handle: "poliquant", theme: "Techwear / funcion", contact_person: "Junichi Sugita", contact_instagrams: [], followers: 16000, followers_label: "~16K", followers_sub: "marca - Tokyo", country: "JP", via: "DM marca", is_email: false, is_hot: false },
  { id: "cyderboy", cat: "Marca", brand: "CYDERBOY / CYDERHOUSE", handle: "cyderboy", theme: "Handmade revamp", contact_person: "Yuji Okamoto", contact_instagrams: [{ handle: "ug_okamoto" }], followers: 7300, followers_label: "~7.3K", followers_sub: "personal - Ura-Hara", country: "JP", via: "DM personal", is_email: false, is_hot: false },
  { id: "pronounce", cat: "Marca", brand: "PRONOUNCE", handle: "_pronounce", theme: "Sastreria autoral", contact_person: "Yushan Li / Jun Zhou", contact_instagrams: [], followers: 39000, followers_label: "~39K", followers_sub: "marca - identidad asiatica", country: "CN / UK", via: "DM marca", is_email: false, is_hot: false },
  { id: "commission", cat: "Marca", brand: "Commission", handle: "commissionofficial", theme: "Sastreria / nostalgia", contact_person: "Dylan Cao / Jin Kay", contact_instagrams: [], followers: 76000, followers_label: "~76K", followers_sub: "marca - nostalgia asiatica", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "loudallas", cat: "Marca", brand: "Lou Dallas", handle: "lou_dallas", theme: "Fantasy / upcycling", contact_person: "Raffaella Hanley", contact_instagrams: [], followers: 14000, followers_label: "~14K", followers_sub: "marca - Euphoria-adjacent", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "marlandbackus", cat: "Marca", brand: "Marland Backus", handle: "marlandbackus", theme: "Joyeria industrial / surreal", contact_person: "Marland Backus", contact_instagrams: [{ handle: "marzipanjupiter" }], followers: 33000, followers_label: "33K / 5K", followers_sub: "personal / marca 5K", country: "US / JP", via: "info@marlandbackus.com", is_email: true, is_hot: false },
  { id: "runnybabbit", cat: "Marca", brand: "Runny Babbit", handle: "runny___babbit", theme: "Handmade escultural", contact_person: "Disenador n/d", contact_instagrams: [], followers: 1900, followers_label: "~1.9K", followers_sub: "muy pequeno - Cafe Forgot world", country: "US", via: "DM marca", is_email: false, is_hot: false },
  { id: "marshalcrews", cat: "Estudio", brand: "Marsh / Marshal Crews", handle: "marshalcrews", theme: "Creador / espacio", contact_person: "Marsh", contact_instagrams: [], followers: 367787, followers_label: "~368K", followers_sub: null, country: "US", via: "DM", is_email: false, is_hot: false },
  { id: "outofcore", cat: "Marca", brand: "Out of Core", handle: "out.of.core", theme: "Eyewear", contact_person: "n/d", contact_instagrams: [], followers: 12940, followers_label: "~12.9K", followers_sub: null, country: "Global", via: "DM marca", is_email: false, is_hot: false },
  { id: "ravemoreberlin", cat: "Estudio", brand: "Ravemore Berlin", handle: "ravemoreberlin", theme: "Rave / eventos", contact_person: "n/d", contact_instagrams: [], followers: 101318, followers_label: "~101K", followers_sub: null, country: "DE", via: "DM", is_email: false, is_hot: false },
  { id: "sume78", cat: "Marca", brand: "Sume Apparel", handle: "sume.78", theme: "Streetwear / apparel", contact_person: "n/d", contact_instagrams: [], followers: 70900, followers_label: "~71K", followers_sub: null, country: "US", via: "team@sumeapparel.com", is_email: true, is_hot: false },
  { id: "aesirstudios", cat: "Marca", brand: "Aesir Studios", handle: "aesir.studios", theme: "Designer brand", contact_person: "n/d (germano-vietnamita)", contact_instagrams: [], followers: 81855, followers_label: "~82K", followers_sub: null, country: "DE", via: "DM marca", is_email: false, is_hot: false },
  { id: "peoplesense", cat: "Marca", brand: "Peoplesense", handle: "_peoplesense_", theme: "Raw denim", contact_person: "n/d", contact_instagrams: [], followers: 75378, followers_label: "~75K", followers_sub: "peoplestyle.shop", country: "Global", via: "Web peoplestyle.shop", is_email: false, is_hot: false },
  { id: "repartostudio", cat: "Estudio", brand: "Reparto Studio", handle: "repartostudio", theme: "Estudio creativo / personajes", contact_person: "n/d", contact_instagrams: [], followers: 16968, followers_label: "~17K", followers_sub: null, country: "Global", via: "agency@lobby.pr", is_email: true, is_hot: false },
  { id: "crvdae", cat: "Marca", brand: "CRVDAE", handle: "crvdae", theme: "Denim / fashion", contact_person: "n/d", contact_instagrams: [], followers: 101621, followers_label: "~102K", followers_sub: null, country: "Global", via: "info@crvdae.com", is_email: true, is_hot: false },
  { id: "belvet", cat: "Marca", brand: "BELVET", handle: "belvet.jp", theme: "Workwear (JP)", contact_person: "n/d", contact_instagrams: [], followers: 99436, followers_label: "~99K", followers_sub: null, country: "JP", via: "DM / online store", is_email: false, is_hot: false },
  { id: "suspiciousantwerp", cat: "Marca", brand: "Suspicious Antwerp", handle: "suspiciousantwerp", theme: "European streetwear / retail", contact_person: "Support / brand team", contact_instagrams: [{ handle: "suspiciousantwerp" }], followers: 479000, followers_label: "479K", followers_sub: "marca", country: "BE / EU", via: "info@suspiciousantwerp.com / web / DM", is_email: true, is_hot: true, notes: "Origen batch jun 2026. Score 94. Fuente: https://www.instagram.com/p/DZ453pDMT0D/ Evidencia: Post 2026-06-22: 2.6K likes. Web oficial y customer service activos; tiendas en BE/NL. Angulo: Marca grande con retail y drops. Propuesta premium: CGI de prenda, retail screen content y short-form edits." },
  { id: "ditch", cat: "Marca", brand: "DITCH", handle: "ditch", theme: "Streetwear drops / zipups", contact_person: "Equipo DITCH", contact_instagrams: [{ handle: "ditch" }], followers: 180000, followers_label: "180K", followers_sub: "marca", country: "US", via: "contact@ditch.la / Discord / DM", is_email: true, is_hot: true, notes: "Origen batch jun 2026. Score 94. Fuente: https://www.instagram.com/p/DZ29Z4wGjCD/ Evidencia: Post 2026-06-21: RUIN ZIPUPS premade 6/27; only account, Discord y free US shipping. Angulo: Lead grande con calendario de drop claro. 3 assets para lanzamiento: teaser, product loop y paid social edit." },
  { id: "moremoneymorelove", cat: "Marca", brand: "MORE MONEY MORE LOVE", handle: "moremoneymorelove.de", theme: "German streetwear / summer drop", contact_person: "Support / Mert Mehmet Bulut", contact_instagrams: [{ handle: "moremoneymorelove.de" }], followers: 171000, followers_label: "171K", followers_sub: "marca", country: "DE", via: "support@moremoneymorelove.de / web / DM", is_email: true, is_hot: true, notes: "Origen batch jun 2026. Score 93. Fuente: https://www.instagram.com/reel/DZNcjfDMOdv/ Evidencia: Reel 2026-06-05: summer collection, 4.9K likes, 393 comments. Imprint con email y direccion en Dusseldorf. Angulo: Engagement fuerte y calendario de coleccion. Teaser para drop, CGI de denim/fleece y pack de reels para ads." },
  { id: "rtabrand", cat: "Marca", brand: "RTA / Road To Awe", handle: "rtabrand", theme: "Luxury streetwear / denim / eyewear", contact_person: "Equipo RTA / Wholesale", contact_instagrams: [{ handle: "rtabrand" }], followers: 143000, followers_label: "143K", followers_sub: "marca", country: "US", via: "wholesale@rtabrand.com / shop@rtabrand.com / DM", is_email: true, is_hot: true, notes: "Origen batch jun 2026. Score 91. Fuente: https://www.instagram.com/reel/DY0K4NwRjhw/ Evidencia: Reel 2026-05-26: PF26 D2 coming soon. Web lista wholesale, shop y career emails. Angulo: Marca establecida; entrar por wholesale/marketing con mock premium: eyewear distortion, denim CGI o PF26 teaser." },
  { id: "belacartes", cat: "Marca", brand: "Belacartes", handle: "belacartess", theme: "Handmade garments / footwear", contact_person: "Equipo Belacartes / Collaborations", contact_instagrams: [{ handle: "belacartess" }], followers: 75000, followers_label: "75K", followers_sub: "marca", country: "US", via: "trent@belacartes.com / contact@belacartes.com / DM", is_email: true, is_hot: true, notes: "Origen batch jun 2026. Score 88. Fuente: https://www.instagram.com/p/DZ5bXaHGgjK/ Evidencia: Post 2026-06-22: SLUG BOOT Blood Edition, 10 pairs only. Contact page con email de colaboraciones. Angulo: Buen fit para CGI de producto limited. Boot render, gritty reveal, launch countdown y assets para social." },
  { id: "misfitmania", cat: "Marca", brand: "Misfit Mania", handle: "_misfitmania", theme: "Shorts / youth streetwear", contact_person: "Equipo Misfit Mania", contact_instagrams: [{ handle: "_misfitmania" }], followers: 51000, followers_label: "51K", followers_sub: "marca", country: "US / Global", via: "misfitmania.com / VIP signup / DM", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 81. Fuente: https://www.instagram.com/reel/DYSSDJhhzTo/ Evidencia: Reel 2026-05-13: Slanted Hoop shorts, 1.4K likes. Web activa y signup VIP/restock. Angulo: Producto simple y vendible. Mini pack de launch visuals: try-on, motion graphics y social ads." },
  { id: "snoresco", cat: "Marca", brand: "snores", handle: "snoresco", theme: "Streetwear / graphic tees", contact_person: "Equipo SNORES", contact_instagrams: [{ handle: "snoresco" }], followers: 39000, followers_label: "39K", followers_sub: "marca", country: "FR / EU", via: "snoresco.com / DM", is_email: false, is_hot: true, notes: "Origen batch jun 2026. Score 84. Fuente: https://www.instagram.com/reel/DXcLryBDBjz/ Evidencia: Reel 2026-04-22: GET READY, 3.1K likes. Trustpilot lista snoresco.com en Francia. Angulo: Marca joven con buen ratio. Visuales de countdown/drop y edits de producto para IG." },
  { id: "viracocha", cat: "Marca", brand: "*VIRACOCHA", handle: "viracocha.uk", theme: "Denim / selvedge / UK streetwear", contact_person: "Equipo VIRACOCHA", contact_instagrams: [{ handle: "viracocha.uk" }], followers: 24000, followers_label: "24K", followers_sub: "marca", country: "UK", via: "DM marca / checkout web", is_email: false, is_hot: true, notes: "Origen batch jun 2026. Score 82. Fuente: https://www.instagram.com/p/DZpJ1gmg5iy/ Evidencia: Post 2026-06-16: Trinity Tiger 14oz Japanese Selvedge Denim. Angulo: Producto visual y drop limitado. Video macro denim, fit CGI, packshot animado o campana para nuevo drop." },
  { id: "toofar", cat: "Marca", brand: "toofar", handle: "toofar.us", theme: "Denim / archive fashion", contact_person: "Equipo toofar", contact_instagrams: [{ handle: "toofar.us" }], followers: 19000, followers_label: "19K", followers_sub: "marca", country: "US", via: "toofar.us/contact / DM", is_email: false, is_hot: true, notes: "Origen batch jun 2026. Score 84. Fuente: https://www.instagram.com/reel/DWx0FQBkRQm/ Evidencia: Reel 2026-04-05: 16K likes para carbon headquarters denim; web con seccion CONTACT. Angulo: Engagement altisimo para su tamano. Visuales para denim: fit guide animado, closeups de textura y teaser de drop." },
  { id: "inspire4l", cat: "Marca", brand: "Inspire", handle: "inspire.4l", theme: "Waxed denim / alt fashion", contact_person: "Owner @lewckiie / team", contact_instagrams: [{ handle: "inspire.4l" }, { handle: "lewckiie" }], followers: 18000, followers_label: "18K", followers_sub: "marca", country: "EU / Global", via: "inspire4l.com / DM owner", is_email: false, is_hot: true, notes: "Origen batch jun 2026. Score 80. Fuente: https://www.instagram.com/reel/DYKvN8qNSEg/ Evidencia: Reel 2026-05-10: 35K likes. Owner @lewckiie, site open, worldwide shipping. Angulo: Viralidad muy alta para 18K. DM al owner para convertir ese pico en drop campaign: denim closeups y cinematic fit reels." },
  { id: "marcosqrd", cat: "Marca", brand: "Marco SQRD", handle: "marco.sqrd", theme: "Archive luxury / showroom / styling", contact_person: "Marco SQRD showroom", contact_instagrams: [{ handle: "marco.sqrd" }], followers: 12000, followers_label: "12K", followers_sub: "showroom", country: "US", via: "sqrd.marco@gmail.com / DM / showroom", is_email: true, is_hot: false, notes: "Origen batch jun 2026. Score 78. Cat original: Tienda. Fuente: https://www.instagram.com/reel/DXPGzCUkVgt/ Evidencia: Reel 2026-04-17: Balenciaga Venom boots, 9.9K likes. Web con styling service y email. Angulo: Mas showroom/servicio que marca propia. Contenido para piezas raras: reels de archivo, styling film y CGI/object scans." },
  { id: "drkpassengers", cat: "Marca", brand: "Dark Passengers", handle: "drkpassengers", theme: "Dark streetwear / moto hoodie", contact_person: "Equipo Dark Passengers", contact_instagrams: [{ handle: "drkpassengers" }], followers: 10000, followers_label: "10K", followers_sub: "marca", country: "US", via: "darkpassengers.co / DM", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 72. Fuente: https://www.instagram.com/reel/DYqmBnIsixo/ Evidencia: Reel 2026-05-22: 565 likes. Shopify activa con moto hoodie y track jacket. Angulo: Marca pequena con estetica clara. 2 reels de producto oscuro, lighting dramatico y edit rapido para drop." },
  { id: "gabrielankar", cat: "Estudio", brand: "Gabriel Ankar", handle: "gabriel_ankar", theme: "Creative direction / CGI / fashion object", contact_person: "Gabriel Ankar", contact_instagrams: [{ handle: "gabriel_ankar" }], followers: 10000, followers_label: "10K", followers_sub: "creative direction + CGI Paris", country: "FR / EU", via: "DM personal", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 70. Cat original: Creador. Fuente: https://www.instagram.com/reel/DYPsy5IsZZN/ Evidencia: Reel 2026-05-12: production/shipping update. Perfil: Creative Direction + CGI Paris. Angulo: Mas colaborador que cliente. Apoyo de CGI/edit para sus drops, making-of o colaboracion fashion film." },
  { id: "floriacharchives", cat: "Marca", brand: "FLORIACH ARCHIVES", handle: "floriacharchives", theme: "Archive-inspired garments / Shopify", contact_person: "Equipo Floriach Archives", contact_instagrams: [{ handle: "floriacharchives" }], followers: 14000, followers_label: "14K", followers_sub: "marca", country: "EU / Global", via: "floriacharchives.com / Shop / DM", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 69. Fuente: https://www.instagram.com/reel/DZ4avdTtdEJ/ Evidencia: Reel 2026-06-22: last units online. Worldwide shipping; Shop app con tienda y reviews. Angulo: Marca pequena con stock activo. Visuales rapidos para last units/restock: product loops y edits de catalogo." },
  { id: "metapoint", cat: "Estudio", brand: "Metapoint", handle: "metapoint.xyz", theme: "CGI / 3D artist / covers", contact_person: "Alex / Metapoint", contact_instagrams: [{ handle: "metapoint.xyz" }, { handle: "jonasunden" }], followers: 9535, followers_label: "9.5K", followers_sub: "3D artist, Prague", country: "CZ / EU", via: "DM / metapoint.xyz", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 76. Fuente: https://www.instagram.com/p/DZbO1bQiAYh/ Evidencia: Post 2026-06-10: covers para @ikkimel42; CGI @metapoint.xyz, foto/CD @jonasunden. Angulo: Posible colaborador/estudio hermano. Overflow de CGI, compositing, IA/video o colaboracion music/fashion." },
  { id: "meyoni", cat: "Marca", brand: "meyoni", handle: "meyoni.co", theme: "Low-rise denim / alt womenswear", contact_person: "Equipo Meyoni", contact_instagrams: [{ handle: "meyoni.co" }], followers: 9334, followers_label: "9.3K", followers_sub: "marca", country: "US / Global", via: "SMS (877) 352-8290 / DM", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 67. Fuente: https://www.instagram.com/reel/DZ5TfyyoWJb/ Evidencia: Reel 2026-06-22: low-rise denim, SMS early access. Perfil lista numero SMS. Angulo: Buen fit de producto para denim. DM corto: assets para 4th of July/drop, fit reels y detalle de costuras." },
  { id: "emmaeickhout", cat: "Estudio", brand: "Emma Eickhout", handle: "buiitenaardswezen", theme: "Graphic design / poster / typography", contact_person: "Emma Eickhout", contact_instagrams: [{ handle: "buiitenaardswezen" }], followers: 6325, followers_label: "6.3K", followers_sub: "open for commissions", country: "NL", via: "eeickhout@gmail.com / DM", is_email: true, is_hot: false, notes: "Origen batch jun 2026. Score 70. Cat original: Creador. Fuente: https://www.instagram.com/reel/DZAgbhaI-77/ Evidencia: Reel 2026-05-31: 5.8K likes. Perfil: open for commissions y email. Angulo: Colaboradora visual fuerte. Intercambio/colab para posters animados, typography loops o pitch decks." },
  { id: "emfo", cat: "Marca", brand: "EMFO", handle: "_emfo_", theme: "Arte wearable / audiovisual", contact_person: "EMFO + Esteban Azuela + LINEA 2", contact_instagrams: [{ handle: "_emfo_" }, { handle: "esesteban" }, { handle: "linea2.mx" }], followers: 5245, followers_label: "5.2K", followers_sub: "EMFO; LINEA 2 4.1K", country: "MX", via: "DM equipo / LINEA 2", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 72. Fuente: https://www.instagram.com/reel/DZ1fnoioi6o/ Evidencia: Reel 2026-06-20: 'Caverna'. Visual @esesteban @linea2.mx; Audio @_emfo_. Angulo: Lenguaje conceptual y audiovisual. Pieza onirica/CGI para lanzamiento o visualizer." },
  { id: "mineralarchive", cat: "Marca", brand: "Mineral Archive", handle: "mineralarchiveshop", theme: "Graphic tees / underground fashion", contact_person: "Equipo Mineral Archive", contact_instagrams: [{ handle: "mineralarchiveshop" }], followers: 723, followers_label: "723", followers_sub: "marca nueva", country: "UK", via: "mineralarchiveshop.com / DM", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 66. Fuente: https://www.instagram.com/reel/DZ2zmpHIBej/ Evidencia: Reel 2026-06-21: heavy weight vintage wash shirts. Shopify activa con newsletter. Angulo: Marca pequena con post de ratio alto. Paquete entry: 3 reels de producto, mockups y visuales para drop." },
  { id: "bymyonn", cat: "Marca", brand: "My'on", handle: "bymyonn", theme: "Niche streetwear / tees", contact_person: "Equipo My'on / Nylan Cannon (creativo)", contact_instagrams: [{ handle: "bymyonn" }, { handle: "nylancannonn" }], followers: 351, followers_label: "351", followers_sub: "marca emergente", country: "US", via: "DM marca", is_email: false, is_hot: false, notes: "Origen batch jun 2026. Score 64. Fuente: https://www.instagram.com/reel/DZ3tzexOIrc/ Evidencia: Reel 2026-06-21: 1.6K likes, tees drop next month, link in bio. Angulo: Cuenta pequena con viralidad puntual. DM tactico: visuales rapidos para el drop del mes que viene." }
];

let leads = [];
let crmImportSourcesLoaded = false;
let activeUser = null;
let activeAdminRecord = null;
let authDebug = false;
let sharedRefreshTimer = 0;
let isLoadingLeads = false;
let view = {
  cat: "all",
  theme: "all",
  sort: "foll_desc",
  status: "all",
  q: "",
  group: false
};

function showPanel(panel) {
  panels.forEach((item) => item.classList.toggle("is-hidden", item !== panel));
}

function setMessage(text, isError = false) {
  loginMessage.textContent = text;
  loginMessage.classList.toggle("is-error", isError);
}

function setAuthDebug(enabled) {
  authDebug = enabled;
}

function debugAuthStep(text) {
  if (!authDebug) return;
  setMessage(text);
}

function setLoading(isLoading) {
  const button = loginForm.querySelector("button");
  button.disabled = isLoading;
  emailInput.disabled = isLoading;
  passwordInput.disabled = isLoading;
}

function setCrmMessage(text, isError = false) {
  crmMessage.textContent = text;
  crmMessage.classList.toggle("is-error", isError);
}

function getWelcomeMessage(email) {
  const normalized = String(email || "").trim().toLowerCase();
  const greetings = {
    "duqueworks@gmail.com": "Hola Alex :)",
    "mduquefernando@gmail.com": "Hola Fernando :)",
    "eloi.calopa@gmail.com": "Hi Elo :)"
  };

  return greetings[normalized] || "";
}

function getSetupErrorMessage(error) {
  const message = error?.message || "";
  if (message.includes("Invalid login credentials")) {
    return "Email o contrasena incorrectos.";
  }
  if (message.includes("over_email_send_rate_limit")) {
    return "Espera 35 segundos antes de pedir otro enlace.";
  }
  if (message.includes("security purposes") && message.includes("35 seconds")) {
    return "Espera 35 segundos antes de pedir otro enlace.";
  }
  if (
    message.includes("admin_users") ||
    message.includes("admin_leads") ||
    message.includes("schema cache")
  ) {
    return "Falta ejecutar supabase-admin-setup.sql en Supabase. Abre SQL Editor, pega el archivo entero y pulsa Run.";
  }
  return message || "Error de Supabase";
}

function getRedirectUrl() {
  return new URL("admin.html", window.location.href).href;
}

function getStorageSession() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveSession(session) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

function clearLegacySessions() {
  LEGACY_SESSION_KEYS.forEach((key) => {
    window.localStorage.removeItem(key);
  });
}

function getStaticLeadState() {
  try {
    return JSON.parse(window.localStorage.getItem(STATIC_LEAD_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveStaticLeadState(state) {
  window.localStorage.setItem(STATIC_LEAD_STATE_KEY, JSON.stringify(state));
}

function removeStaticLeadState(id) {
  const state = getStaticLeadState();
  if (!state[id]) return;
  delete state[id];
  saveStaticLeadState(state);
}

function toSharedLeadPayload(lead, patch = {}) {
  const merged = {
    hit: false,
    status: "pendiente",
    notes: "",
    ...lead,
    ...patch
  };

  return {
    id: merged.id,
    cat: merged.cat,
    brand: merged.brand,
    handle: merged.handle,
    theme: merged.theme,
    contact_person: merged.contact_person,
    contact_instagrams: merged.contact_instagrams || [],
    followers: merged.followers,
    followers_label: merged.followers_label || "n/d",
    followers_sub: merged.followers_sub || null,
    country: merged.country,
    via: merged.via,
    is_email: Boolean(merged.is_email),
    is_hot: Boolean(merged.is_hot),
    hit: Boolean(merged.hit),
    status: merged.status || "pendiente",
    notes: merged.notes || "",
    updated_at: new Date().toISOString(),
    updated_by: activeUser?.email || null
  };
}

function hasPendingNotesEdit() {
  return leads.some((lead) => lead.notesTimer) || document.activeElement?.dataset?.act === "notes";
}

function getMergedLeads(rows) {
  const seen = new Set(rows.map((lead) => lead.id));
  const state = getStaticLeadState();
  const staticRows = EXTRA_LEADS
    .filter((lead) => !seen.has(lead.id))
    .map((lead) => ({
      hit: false,
      status: "pendiente",
      notes: "",
      ...lead,
      ...(state[lead.id] || {}),
      _isStaticLead: true
    }));

  return [...rows, ...staticRows];
}

function getMissingExtraLeads(rows) {
  const seen = new Set(rows.map((lead) => lead.id));
  return EXTRA_LEADS.filter((lead) => !seen.has(lead.id));
}

async function upsertSharedLeads(rows) {
  if (!rows.length) return;

  await apiRequest("/rest/v1/admin_leads?on_conflict=id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(rows.map((lead) => toSharedLeadPayload(lead)))
  });
}

function updateStaticLead(id, patch) {
  const state = getStaticLeadState();
  state[id] = {
    hit: false,
    status: "pendiente",
    notes: "",
    ...(state[id] || {}),
    ...patch
  };
  saveStaticLeadState(state);
  setCrmMessage("Guardado en este navegador");
  window.setTimeout(() => {
    if (crmMessage.textContent === "Guardado en este navegador") setCrmMessage("");
  }, 1200);
  return true;
}

function parseJwtPayload(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getStoredUser() {
  const session = getStorageSession();
  if (!session?.access_token) return null;

  const payload = parseJwtPayload(session.access_token);
  const email = session.user?.email || payload?.email || "";
  if (!email) return null;

  return {
    email
  };
}

async function withTimeout(promise, timeoutMs, message) {
  let timeoutId = 0;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function sendMagicLink(email) {
  const url = new URL(`${SUPABASE_URL}/auth/v1/otp`);
  url.searchParams.set("redirect_to", getRedirectUrl());

  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      email,
      create_user: true,
      gotrue_meta_security: {}
    })
  });

  if (!response.ok) {
    let message = `Supabase Auth error ${response.status}`;
    try {
      const payload = await response.json();
      message = payload.msg || payload.message || payload.error_description || message;
    } catch {
      message = await response.text();
    }
    throw new Error(message);
  }
}

async function signInWithPassword(email, password) {
  debugAuthStep("Pidiendo acceso a Supabase...");
  const url = new URL(`${SUPABASE_URL}/auth/v1/token`);
  url.searchParams.set("grant_type", "password");

  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({ email, password })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      payload?.msg || payload?.message || payload?.error_description || `Supabase Auth error ${response.status}`
    );
  }

  debugAuthStep("Sesion recibida. Guardando acceso...");
  saveSession({
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    user: payload.user ? { email: payload.user.email } : { email }
  });
  debugAuthStep("Sesion guardada.");
}

async function refreshSession() {
  const session = getStorageSession();
  if (!session?.refresh_token) throw new Error("Sesion caducada. Vuelve a entrar.");

  const url = new URL(`${SUPABASE_URL}/auth/v1/token`);
  url.searchParams.set("grant_type", "refresh_token");

  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      refresh_token: session.refresh_token
    })
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    clearSession();
    throw new Error(
      payload?.msg || payload?.message || payload?.error_description || "Sesion caducada. Vuelve a entrar."
    );
  }

  saveSession({
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    user: payload.user ? { email: payload.user.email } : session.user
  });
}

async function apiRequest(path, options = {}, retry = true) {
  const session = getStorageSession();
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${session?.access_token || SUPABASE_ANON_KEY}`,
    ...options.headers
  };

  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers
  });

  if (response.status === 401 && retry && session?.refresh_token) {
    await refreshSession();
    return apiRequest(path, options, false);
  }

  if (!response.ok) {
    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    throw new Error(
      payload?.msg ||
      payload?.message ||
      payload?.error_description ||
      payload?.hint ||
      `Supabase error ${response.status}`
    );
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function maybeConsumeMagicLinkTokens() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const accessToken = hash.get("access_token");
  const refreshToken = hash.get("refresh_token");
  const errorDescription = hash.get("error_description");

  if (errorDescription) {
    setMessage(errorDescription, true);
    history.replaceState(null, "", window.location.pathname + window.location.search);
    return;
  }

  if (!accessToken || !refreshToken) return;

  const payload = parseJwtPayload(accessToken);
  saveSession({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: payload?.email ? { email: payload.email } : null
  });
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

async function signOut() {
  clearSession();
  stopSharedRefresh();
  logoutButton.classList.add("is-hidden");
  welcomeBanner.textContent = "";
  showPanel(loginPanel);
}

function decodeHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value || "";
  return textarea.value;
}

function textFromHtml(value) {
  return decodeHtml(String(value || "").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}


function getUniqueValues(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function slugifyLeadId(value) {
  return String(value || "lead")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 36) || "lead";
}

function getImportedLeadHandle(card, handleText) {
  if (handleText.startsWith("@")) return handleText.slice(1);

  const handleLink = card.querySelector(".card-handle a")?.href || "";
  if (handleLink.includes("instagram.com/")) {
    return handleLink.split("instagram.com/")[1].split(/[?#/]/)[0];
  }

  return handleText;
}

function parseImportedLeadCard(card, source) {
  const brand = textFromHtml(card.querySelector(".card-name")?.innerHTML);
  const handleText = textFromHtml(card.querySelector(".card-handle")?.innerHTML);
  const handle = getImportedLeadHandle(card, handleText);
  const type = textFromHtml(card.querySelector(".card-type")?.innerHTML);
  const score = Number(textFromHtml(card.querySelector(".card-score")?.childNodes[0]?.textContent));
  const tags = getUniqueValues(Array.from(card.querySelectorAll(".tag")).map((tag) => textFromHtml(tag.innerHTML)));
  const description = textFromHtml(card.querySelector(".card-desc")?.innerHTML);
  const clients = textFromHtml(card.querySelector(".card-clients")?.innerHTML);
  const angle = textFromHtml(card.querySelector(".card-angle")?.innerHTML);
  const contactHtml = card.querySelector(".contact-info")?.innerHTML || "";
  const contactText = textFromHtml(contactHtml);
  const emails = getUniqueValues(Array.from(contactHtml.matchAll(/mailto:([^"?]+)/g)).map((match) => decodeHtml(match[1])));
  const instagrams = getUniqueValues(Array.from(contactHtml.matchAll(/instagram\.com\/([^"?#/]+)/g)).map((match) => decodeHtml(match[1])));
  const via = getUniqueValues([...emails, ...instagrams.map((item) => `@${item}`)]).join(" / ") || contactText || handle || "n/d";
  const contactPerson = contactText
    .replace(emails.join(" "), "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120) || brand;
  const notes = [
    `Origen ${source.origin}.`,
    `Score ${Number.isFinite(score) ? score : "n/d"}.`,
    clients ? `${clients}.` : "",
    description,
    angle ? `Angulo: ${angle}` : ""
  ].filter(Boolean).join(" ");

  return {
    id: `${source.country.toLowerCase()}-${slugifyLeadId(brand || handle)}`,
    cat: "Estudio",
    brand,
    handle,
    theme: getUniqueValues([type, ...tags]).join(" / ") || source.origin,
    contact_person: contactPerson,
    contact_instagrams: instagrams.map((item) => ({ handle: item })),
    followers: null,
    followers_label: "n/d",
    followers_sub: type || null,
    country: source.country,
    via,
    is_email: emails.length > 0,
    is_hot: Number.isFinite(score) && score >= 85,
    notes
  };
}

function getImportedProspectCountry(row) {
  const rawCountry = row.dataset.country || textFromHtml(row.querySelector(".country-tag")?.innerHTML);
  const map = { fr: "FR", jp: "JP", uk: "UK", us: "US", france: "FR", francia: "FR", japon: "JP" };
  const normalized = rawCountry.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return map[normalized] || rawCountry.toUpperCase() || "Global";
}

function parseImportedProspectRow(row, source) {
  const brand = textFromHtml(row.querySelector(".studio-name")?.innerHTML);
  const type = textFromHtml(row.querySelector(".studio-type")?.innerHTML);
  const country = getImportedProspectCountry(row);
  const encaje = textFromHtml(row.querySelector(".encaje")?.innerHTML);
  const contactNames = Array.from(row.querySelectorAll(".contact-name"));
  const contactRoles = Array.from(row.querySelectorAll(".contact-role"));
  const contacts = contactNames.map((item, index) => {
    const name = textFromHtml(item.innerHTML);
    const role = textFromHtml(contactRoles[index]?.innerHTML);
    return role ? `${name} (${role})` : name;
  });
  const instagramLinks = Array.from(row.querySelectorAll(".ig-link"));
  const instagrams = getUniqueValues(instagramLinks.map((link) => textFromHtml(link.innerHTML).replace(/^@/, "")));
  const primaryHandle = instagrams[instagrams.length - 1] || "";
  const contactLink = row.querySelector(".email-link");
  const contactHref = contactLink?.getAttribute("href") || "";
  const contactText = textFromHtml(contactLink?.innerHTML);
  const email = contactHref.startsWith("mailto:") ? contactHref.slice(7).split("?")[0] : "";
  const via = getUniqueValues([email || contactText, ...instagrams.map((item) => `@${item}`)]).join(" / ") || "n/d";
  const rowNotes = textFromHtml(row.querySelector(".notes")?.innerHTML);
  const notes = [
    `Origen ${source.origin}.`,
    encaje ? `Encaje ${encaje}.` : "",
    rowNotes
  ].filter(Boolean).join(" ");

  return {
    id: `${country.toLowerCase()}-${slugifyLeadId(brand || primaryHandle)}`,
    cat: "Estudio",
    brand,
    handle: primaryHandle,
    theme: getUniqueValues([type, encaje ? `Encaje ${encaje}` : ""]).join(" / ") || source.origin,
    contact_person: contacts.join(" / ") || brand,
    contact_instagrams: instagrams.map((handle) => ({ handle })),
    followers: null,
    followers_label: "n/d",
    followers_sub: type || null,
    country,
    via,
    is_email: Boolean(email),
    is_hot: /muy\s+alto/i.test(encaje),
    notes
  };
}
async function loadCrmImportSources() {
  if (crmImportSourcesLoaded) return;
  const importedLeads = [];

  for (const source of CRM_IMPORT_SOURCES) {
    const response = await fetch(source.url, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se pudo cargar ${source.url}`);

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const selector = source.type === "table" ? "tbody tr" : ".card";
    const parser = source.type === "table" ? parseImportedProspectRow : parseImportedLeadCard;
    doc.querySelectorAll(selector).forEach((item) => {
      const lead = parser(item, source);
      if (lead.brand) importedLeads.push(lead);
    });
  }

  const existingIds = new Set(EXTRA_LEADS.map((lead) => lead.id));
  importedLeads.forEach((lead) => {
    if (!existingIds.has(lead.id)) {
      EXTRA_LEADS.push(lead);
      existingIds.add(lead.id);
    }
  });
  crmImportSourcesLoaded = true;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getFollowersValue(lead) {
  return lead.followers == null ? -1 : Number(lead.followers);
}

function getVisibleLeads() {
  return leads.filter((lead) => {
    if (view.cat !== "all" && lead.cat !== view.cat) return false;
    if (view.theme !== "all" && lead.theme !== view.theme) return false;
    if (view.status !== "all" && lead.status !== view.status) return false;
    if (!view.q) return true;

    const haystack = [
      lead.brand,
      lead.contact_person,
      lead.handle,
      lead.theme,
      lead.country,
      lead.via,
      ...(lead.contact_instagrams || []).map((item) => item.handle)
    ].join(" ").toLowerCase();

    return haystack.includes(view.q.toLowerCase());
  });
}

function sortLeads(rows) {
  const sorters = {
    foll_desc: (a, b) => getFollowersValue(b) - getFollowersValue(a) || a.brand.localeCompare(b.brand),
    foll_asc: (a, b) => getFollowersValue(a) - getFollowersValue(b) || a.brand.localeCompare(b.brand),
    brand_az: (a, b) => a.brand.localeCompare(b.brand),
    theme: (a, b) => a.theme.localeCompare(b.theme) || getFollowersValue(b) - getFollowersValue(a)
  };

  return rows.slice().sort(sorters[view.sort] || sorters.foll_desc);
}

function renderInstagramCell(lead) {
  if (!lead.contact_instagrams?.length) {
    return '<span class="nd">-</span>';
  }

  return lead.contact_instagrams.map((item) => {
    const handle = escapeHtml(item.handle);
    const note = item.note ? ` <span class="ig-note">(${escapeHtml(item.note)})</span>` : "";
    return `<span class="ig"><a href="https://instagram.com/${handle}" target="_blank" rel="noopener">@${handle}</a>${note}</span>`;
  }).join("<br>");
}

function renderFollowers(lead) {
  if (lead.followers == null) {
    return '<span class="nd">n/d</span>';
  }

  const sub = lead.followers_sub ? `<span class="sub">${escapeHtml(lead.followers_sub)}</span>` : "";
  return `<span>${escapeHtml(lead.followers_label)}</span>${sub}`;
}

function renderLeadRow(lead) {
  const hotTag = lead.is_hot ? '<span class="hot-tag">hot</span>' : "";
  const rowClass = lead.hit || lead.status === "cerrado" ? "done" : "";
  const status = lead.status || "pendiente";

  return `<tr class="${rowClass}" data-id="${escapeHtml(lead.id)}">
    <td><div class="chk"><input type="checkbox" data-act="hit" ${lead.hit ? "checked" : ""} title="Hiteado"></div></td>
    <td>
      <span class="brandname">${escapeHtml(lead.brand)}${hotTag}</span>
      <span class="handle"><a href="https://instagram.com/${escapeHtml(lead.handle)}" target="_blank" rel="noopener">@${escapeHtml(lead.handle)}</a></span>
    </td>
    <td><span class="tema">${escapeHtml(lead.theme)}</span></td>
    <td>${escapeHtml(lead.contact_person)}</td>
    <td>${renderInstagramCell(lead)}</td>
    <td class="followers">${renderFollowers(lead)}</td>
    <td>${escapeHtml(lead.country)}</td>
    <td class="via ${lead.is_email ? "email" : ""}">${escapeHtml(lead.via)}</td>
    <td>
      <select class="status" data-act="status" data-s="${escapeHtml(status)}">
        <option value="pendiente"${status === "pendiente" ? " selected" : ""}>Pendiente</option>
        <option value="hiteado"${status === "hiteado" ? " selected" : ""}>Hiteado</option>
        <option value="respondio"${status === "respondio" ? " selected" : ""}>Respondio</option>
        <option value="cerrado"${status === "cerrado" ? " selected" : ""}>Cerrado</option>
        <option value="descartado"${status === "descartado" ? " selected" : ""}>Descartado</option>
      </select>
    </td>
    <td class="notes"><div contenteditable data-act="notes">${escapeHtml(lead.notes || "")}</div></td>
  </tr>`;
}

function populateThemes() {
  const current = temaSel.value || "all";
  const themes = [...new Set(leads.map((lead) => lead.theme))].sort();
  temaSel.innerHTML = '<option value="all">Todas</option>';
  themes.forEach((theme) => {
    const option = document.createElement("option");
    option.value = theme;
    option.textContent = theme;
    temaSel.appendChild(option);
  });
  temaSel.value = themes.includes(current) ? current : "all";
  view.theme = temaSel.value;
}

function updateProgress() {
  const total = leads.length;
  const done = leads.filter((lead) => lead.hit).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  document.getElementById("barFill").style.width = `${pct}%`;
  document.getElementById("barNum").textContent = `${done} / ${total} hiteados`;
  document.getElementById("metaCount").textContent = total;
}

function syncArrows() {
  document.querySelectorAll("th.sortable").forEach((th) => {
    const key = th.dataset.sort;
    const active =
      (key === "followers" && view.sort.startsWith("foll")) ||
      (key === "brand" && view.sort === "brand_az") ||
      (key === "theme" && view.sort === "theme");
    th.dataset.active = String(active);
    const arrow = th.querySelector(".arrow");
    if (key === "followers") {
      arrow.textContent = view.sort === "foll_asc" ? "^" : "v";
    }
  });
}

function renderCrm() {
  const rows = getVisibleLeads();
  let html = "";

  if (!rows.length) {
    html = '<tr><td colspan="10" class="empty">Sin resultados con estos filtros</td></tr>';
  } else if (view.group) {
    const groups = {};
    rows.forEach((lead) => {
      groups[lead.theme] = groups[lead.theme] || [];
      groups[lead.theme].push(lead);
    });

    Object.keys(groups).sort().forEach((theme) => {
      const group = sortLeads(groups[theme]);
      html += `<tr class="group-row"><td colspan="10">${escapeHtml(theme)}<span class="count">${group.length}</span></td></tr>`;
      html += group.map(renderLeadRow).join("");
    });
  } else {
    html = sortLeads(rows).map(renderLeadRow).join("");
  }

  tbody.innerHTML = html;
  syncArrows();
  updateProgress();
}

async function loadLeads() {
  if (isLoadingLeads) return;
  isLoadingLeads = true;
  setCrmMessage("Cargando leads...");
  try {
    await loadCrmImportSources();
    let data = await apiRequest("/rest/v1/admin_leads?select=*&order=brand.asc");
    const missing = getMissingExtraLeads(data || []);
    if (missing.length) {
      await upsertSharedLeads(missing);
      data = await apiRequest("/rest/v1/admin_leads?select=*&order=brand.asc");
      missing.forEach((lead) => removeStaticLeadState(lead.id));
    }

    leads = getMergedLeads(data || []);
    populateThemes();
    renderCrm();
    setCrmMessage("");
  } catch (error) {
    leads = [];
    tbody.innerHTML = '<tr><td colspan="10" class="empty">Ejecuta el SQL de setup en Supabase</td></tr>';
    updateProgress();
    setCrmMessage(getSetupErrorMessage(error), true);
  } finally {
    isLoadingLeads = false;
  }
}

async function refreshSharedLeads() {
  if (!activeUser || hasPendingNotesEdit() || document.hidden) return;

  try {
    const data = await apiRequest("/rest/v1/admin_leads?select=*&order=brand.asc");
    leads = getMergedLeads(data || []);
    populateThemes();
    renderCrm();
  } catch {
    // Keep the current view during background refresh failures.
  }
}

function startSharedRefresh() {
  window.clearInterval(sharedRefreshTimer);
  sharedRefreshTimer = window.setInterval(refreshSharedLeads, SHARED_REFRESH_MS);
}

function stopSharedRefresh() {
  window.clearInterval(sharedRefreshTimer);
  sharedRefreshTimer = 0;
}

async function updateLead(id, patch) {
  const lead = leads.find((item) => item.id === id);
  if (lead?._isStaticLead) {
    try {
      await upsertSharedLeads([{ ...lead, ...patch }]);
      delete lead._isStaticLead;
      Object.assign(lead, patch);
      removeStaticLeadState(id);
      setCrmMessage("Guardado en Supabase");
      window.setTimeout(() => {
        if (crmMessage.textContent === "Guardado en Supabase") setCrmMessage("");
      }, 1200);
      return true;
    } catch {
      Object.assign(lead, patch);
      return updateStaticLead(id, patch);
    }
  }

  try {
    await apiRequest(`/rest/v1/admin_leads?id=eq.${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        ...patch,
        updated_at: new Date().toISOString(),
        updated_by: activeUser?.email || null
      })
    });
  } catch (error) {
    setCrmMessage(getSetupErrorMessage(error), true);
    return false;
  }

  setCrmMessage("Guardado");
  window.setTimeout(() => {
    if (crmMessage.textContent === "Guardado") setCrmMessage("");
  }, 1200);
  return true;
}

async function getAdminRecord(user) {
  debugAuthStep("Comprobando permisos admin...");
  const email = user.email.toLowerCase();
  const data = await apiRequest(`/rest/v1/admin_users?select=email,role&email=eq.${encodeURIComponent(email)}`);
  return data?.[0] || null;
}

async function renderSession() {
  debugAuthStep("Leyendo sesion...");
  const user = getStoredUser();
  activeUser = user || null;

  if (!user?.email) {
    stopSharedRefresh();
    logoutButton.classList.add("is-hidden");
    welcomeBanner.textContent = "";
    showPanel(loginPanel);
    return;
  }

  try {
    const adminRecord = await getAdminRecord(user);
    if (!adminRecord) {
      logoutButton.classList.remove("is-hidden");
      showPanel(deniedPanel);
      return;
    }

    activeAdminRecord = adminRecord;
    sessionLabel.textContent = user.email;
    roleLabel.textContent = adminRecord.role || "admin";
    welcomeBanner.textContent = getWelcomeMessage(user.email);
    logoutButton.classList.remove("is-hidden");
    showPanel(adminPanel);
    await loadLeads();
    startSharedRefresh();
  } catch (error) {
    welcomeBanner.textContent = "";
    setMessage(getSetupErrorMessage(error), true);
    showPanel(loginPanel);
  }
}

if (!isConfigured) {
  showPanel(configPanel);
} else {
  clearLegacySessions();
  maybeConsumeMagicLinkTokens();
  showPanel(loginPanel);
  renderSession();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!email) {
    setMessage("Escribe un email.", true);
    return;
  }

  setAuthDebug(true);
  setLoading(true);
  setMessage(`Login v14: ${email}`);

  try {
    if (password) {
      await withTimeout(
        signInWithPassword(email, password),
        15000,
        "Supabase no ha respondido. Revisa la conexion o prueba de nuevo."
      );
      await renderSession();
      setLoading(false);
      setAuthDebug(false);
      return;
    }

    setMessage("Enviando enlace de acceso...");
    await withTimeout(
      sendMagicLink(email),
      15000,
      "Supabase no ha respondido. Revisa la conexion o prueba de nuevo."
    );
  } catch (error) {
    setLoading(false);
    setAuthDebug(false);
    setMessage(getSetupErrorMessage(error), true);
    return;
  }

  setLoading(false);
  setAuthDebug(false);
  setMessage("Te hemos enviado un enlace de acceso al email. Mira spam o promociones si no aparece enseguida.");
});

logoutButton.addEventListener("click", signOut);

tbody.addEventListener("change", async (event) => {
  const row = event.target.closest("tr[data-id]");
  if (!row) return;

  const lead = leads.find((item) => item.id === row.dataset.id);
  if (!lead) return;

  const action = event.target.dataset.act;
  if (action === "hit") {
    const hit = event.target.checked;
    const status = hit && lead.status === "pendiente" ? "hiteado" : lead.status;
    Object.assign(lead, { hit, status });
    renderCrm();
    await updateLead(lead.id, { hit, status });
  }

  if (action === "status") {
    const status = event.target.value;
    const hit = status === "hiteado" || status === "cerrado" ? true : lead.hit;
    Object.assign(lead, { status, hit });
    renderCrm();
    await updateLead(lead.id, { status, hit });
  }
});

tbody.addEventListener("input", async (event) => {
  if (event.target.dataset.act !== "notes") return;
  const row = event.target.closest("tr[data-id]");
  const lead = leads.find((item) => item.id === row?.dataset.id);
  if (!lead) return;

  lead.notes = event.target.innerHTML;
  window.clearTimeout(lead.notesTimer);
  lead.notesTimer = window.setTimeout(() => {
    updateLead(lead.id, { notes: lead.notes });
  }, 500);
});

catPills.addEventListener("click", (event) => {
  const button = event.target.closest(".pill");
  if (!button?.dataset.cat) return;
  view.cat = button.dataset.cat;
  catPills.querySelectorAll(".pill").forEach((pill) => {
    pill.setAttribute("aria-pressed", String(pill === button));
  });
  renderCrm();
});

temaSel.addEventListener("change", (event) => {
  view.theme = event.target.value;
  renderCrm();
});

sortSel.addEventListener("change", (event) => {
  view.sort = event.target.value;
  renderCrm();
});

statusSel.addEventListener("change", (event) => {
  view.status = event.target.value;
  renderCrm();
});

searchInput.addEventListener("input", (event) => {
  view.q = event.target.value.trim();
  renderCrm();
});

groupBtn.addEventListener("click", () => {
  view.group = !view.group;
  groupBtn.setAttribute("aria-pressed", String(view.group));
  renderCrm();
});

resetBtn.addEventListener("click", async () => {
  if (!window.confirm("Borrar checks, estados y notas de todos los leads?")) return;
  saveStaticLeadState({});

  try {
    await apiRequest("/rest/v1/admin_leads?id=not.is.null", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        hit: false,
        status: "pendiente",
        notes: "",
        updated_at: new Date().toISOString(),
        updated_by: activeUser?.email || null
      })
    });
  } catch (error) {
    setCrmMessage(getSetupErrorMessage(error), true);
    return;
  }

  await loadLeads();
});

document.querySelectorAll("th.sortable").forEach((th) => {
  th.addEventListener("click", () => {
    const key = th.dataset.sort;
    if (key === "followers") view.sort = view.sort === "foll_desc" ? "foll_asc" : "foll_desc";
    if (key === "brand") view.sort = "brand_az";
    if (key === "theme") view.sort = "theme";
    sortSel.value = view.sort;
    renderCrm();
  });
});
