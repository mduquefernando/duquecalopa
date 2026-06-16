import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
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

let supabase = null;
let leads = [];
let activeUser = null;
let activeAdminRecord = null;
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
  const url = new URL(`${SUPABASE_URL}/auth/v1/token`);
  url.searchParams.set("grant_type", "password");

  const response = await fetch(url.href, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(
      payload?.msg || payload?.message || payload?.error_description || `Supabase Auth error ${response.status}`
    );
  }

  const { error } = await supabase.auth.setSession({
    access_token: payload.access_token,
    refresh_token: payload.refresh_token
  });

  if (error) throw error;
}

async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
  logoutButton.classList.add("is-hidden");
  welcomeBanner.textContent = "";
  showPanel(loginPanel);
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
  setCrmMessage("Cargando leads...");
  const { data, error } = await supabase
    .from("admin_leads")
    .select("*")
    .order("brand", { ascending: true });

  if (error) {
    leads = [];
    tbody.innerHTML = '<tr><td colspan="10" class="empty">Ejecuta el SQL de setup en Supabase</td></tr>';
    updateProgress();
    setCrmMessage(getSetupErrorMessage(error), true);
    return;
  }

  leads = data || [];
  populateThemes();
  renderCrm();
  setCrmMessage("");
}

async function updateLead(id, patch) {
  const { error } = await supabase
    .from("admin_leads")
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
      updated_by: activeUser?.email || null
    })
    .eq("id", id);

  if (error) {
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
  const email = user.email.toLowerCase();
  const { data, error } = await supabase
    .from("admin_users")
    .select("email, role")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function renderSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    setMessage(error.message, true);
    showPanel(loginPanel);
    return;
  }

  const user = data.session?.user;
  activeUser = user || null;
  if (!user?.email) {
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
    loadLeads();
  } catch (error) {
    welcomeBanner.textContent = "";
    setMessage(getSetupErrorMessage(error), true);
    showPanel(loginPanel);
  }
}

if (!isConfigured) {
  showPanel(configPanel);
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  showPanel(loginPanel);
  renderSession();

  supabase.auth.onAuthStateChange(() => {
    window.setTimeout(() => {
      renderSession();
    }, 0);
  });
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase) return;

  setLoading(true);
  setMessage("Comprobando acceso...");

  const form = new FormData(loginForm);
  const email = form.get("email").trim().toLowerCase();
  const password = form.get("password").trim();
  try {
    if (password) {
      await withTimeout(
        signInWithPassword(email, password),
        15000,
        "Supabase no ha respondido. Revisa la conexion o prueba de nuevo."
      );
      setLoading(false);
      setMessage("Acceso correcto.");
      await renderSession();
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
    setMessage(getSetupErrorMessage(error), true);
    return;
  }

  setLoading(false);
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

  const { error } = await supabase
    .from("admin_leads")
    .update({
      hit: false,
      status: "pendiente",
      notes: "",
      updated_at: new Date().toISOString(),
      updated_by: activeUser?.email || null
    })
    .neq("id", "");

  if (error) {
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
