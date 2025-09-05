import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helpers
const currency = (n, c = "EUR") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: c }).format(
    Number(n || 0)
  );
const classNames = (...xs) => xs.filter(Boolean).join(" ");

// Seed catalogue (optionnel)
const SEED_SERVICES = [
  { name: "Plateforme de marque (Brand Book)", price: 2800, description: "Positionnement, promesse, valeurs, guidelines d’usage." },
  { name: "Identité visuelle & logo", price: 1500, description: "3 pistes créatives, 1 finalisée, livrables print/digital." },
  { name: "Charte graphique complète", price: 1900, description: "Typographies, palette, iconographie, grilles, PDF 15–25 pages." },
  { name: "Webdesign UI (maquettes Figma)", price: 1400, description: "Jusqu’à 5 écrans clés + design system de base." },
  { name: "Site vitrine WordPress (5 pages)", price: 1800, description: "Thème léger, formulaires, SEO technique de base, sécurité." },
  { name: "WooCommerce e-commerce (catalogue simple)", price: 2600, description: "Paiement, livraison, 10 produits initiaux, modèles fiche produit." },
  { name: "Développement sur mesure (Laravel)", price: 5200, description: "API REST, back-office basique, tests unitaires de base." },
  { name: "Application CodeIgniter métier", price: 3900, description: "CRUD, auth, vues optimisées." },
  { name: "Front-end SPA React.js", price: 3500, description: "Routing, state léger, intégration API, build optimisé." },
  { name: "Nuxt.js SSR/SSG", price: 3800, description: "SEO-ready, génération statique, intégration headless CMS." },
  { name: "Django app + Admin", price: 4800, description: "Models, admin custom, auth, ORM, prod config." },
  { name: "FastAPI microservices", price: 4200, description: "Endpoints performants, OpenAPI, déploiement conteneurisé." },
  { name: "App mobile React Native (MVP)", price: 5900, description: "4–6 écrans, intégration API, builds iOS/Android." },
  { name: "App mobile Flutter", price: 6400, description: "UI réactive, services natifs, livrables stores." },
  { name: "Audit SEO technique & sémantique", price: 750, description: "Crawl, CWV, indexation, plan d’actions priorisé." },
  { name: "SEO mensuel (forfait)", price: 650, description: "On-page/off-page, netlinking éthique, reporting." },
  { name: "Google Ads (setup + 1 mois)", price: 680, description: "Structure, annonces, conversions, optimisations 4 semaines." },
  { name: "Copywriting pages clés", price: 520, description: "Rédaction conversion pour 5 sections (USP, Offres, CTA)." },
  { name: "Pack contenu blog (4 articles)", price: 520, description: "Briefs SEO, 800–1200 mots, intégration médias." },
  { name: "Automatisation n8n (scénario standard)", price: 700, description: "3–5 nœuds, API courantes, logs basiques." },
  { name: "Automatisation Make", price: 650, description: "5 modules, gestion erreurs, webhook d’entrée." },
  { name: "Agent IA personnalisé (API LLM)", price: 1500, description: "Rôles, prompting, intégration API, garde-fous." },
  { name: "Dashboard Analytics (Looker/Metabase)", price: 1200, description: "6–8 KPIs, 3 dashboards, partage sécurisé." },
  { name: "Plan de marquage & GTM", price: 680, description: "Spéc tracking, balises, Consent Mode, GA4 events." },
  { name: "UX Research rapide", price: 900, description: "Interviews 3–5, parcours, quick wins priorisés." },
  { name: "Prototype haute fidélité", price: 1100, description: "Flux critique cliquable + micro-interactions." },
  { name: "PrestaShop (50 produits)", price: 3400, description: "Thème léger, transporteurs, paiements, perfs de base." },
  { name: "Headless CMS (Strapi)", price: 2100, description: "Modèles, rôles, API sécurisée, CDN médias." },
  { name: "Dockerisation & CI/CD", price: 1200, description: "Dockerfiles, compose, pipelines CI/CD." },
  { name: "Déploiement cloud (VPS)", price: 780, description: "Provision, durcissement, reverse proxy, SSL." },
  { name: "Audit sécurité web", price: 820, description: "OWASP Top 10, headers, dépendances, reco." },
  { name: "Maintenance WordPress (mensuelle)", price: 90, description: "Sauvegardes, MAJ, correctifs mineurs, uptime." },
  { name: "TMA applicative (10h)", price: 650, description: "Banque d’heures support/dev, ticketing." },
  { name: "Emailing CRM (Klaviyo/Mailchimp)", price: 540, description: "Segmentation, 3 automatisations, 2 templates." },
  { name: "Meta Ads (setup + 1 mois)", price: 620, description: "Campagnes, audiences, pixels, créas basiques." },
  { name: "Packshot produits (10 photos)", price: 300, description: "Fond neutre, retouches, export web." },
  { name: "Vidéo courte (30–45s)", price: 380, description: "Script léger, tournage simple, montage, sous-titres." },
  { name: "Formation WordPress (2h)", price: 180, description: "Back-office, bonnes pratiques, sécurité basique." },
  { name: "Conseil technique (fractional CTO)", price: 950, description: "Architecture, choix techno, roadmap trimestrielle." },
  { name: "Pack conformité RGPD (web)", price: 520, description: "Consentement, politiques, DPA modèles, registre." },
  { name: "Optimisation performance (CWV)", price: 680, description: "Lighthouse, images, bundling, plan d’actions." },
  { name: "Recherche sémantique & RAG", price: 2100, description: "Index vecteurs, pipeline ingestion, garde-fous." },
  { name: "QA & tests (lot de base)", price: 380, description: "Plan de tests, cas critiques, rapport anomalies." },
  { name: "Accessibilité (WCAG 2.1 AA - audit)", price: 620, description: "Diagnostic heuristique + plan correctif." },
  { name: "Hébergement managé (mensuel)", price: 35, description: "Sauvegardes quotidiennes, SSL, surveillance." },
  { name: "Support prioritaire", price: 120, description: "Réponse <4h ouvrées, canal dédié." }
];

function useSession() {
  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub?.subscription?.unsubscribe();
  }, []);
  return session;
}

function AuthGate({ children }) {
  const session = useSession();
  if (!session) return <AuthForm />;
  return <>{children}</>;
}

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [msg, setMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Compte créé. Connectez-vous.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">CARRE Quotes CRM</h1>
        <p className="text-sm text-gray-500 mb-6">Connexion à votre espace</p>
        {!!msg && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{msg}</div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full border rounded-lg p-2" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
          <input className="w-full border rounded-lg p-2" placeholder="Mot de passe" value={password} onChange={(e)=>setPassword(e.target.value)} type="password" required />
          <button className="w-full bg-black text-white rounded-lg py-2">{mode === "signin" ? "Se connecter" : "Créer un compte"}</button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          {mode === "signin" ? (
            <button className="underline" onClick={()=>setMode("signup")}>Pas de compte ? Créer un compte</button>
          ) : (
            <button className="underline" onClick={()=>setMode("signin")}>Déjà inscrit ? Se connecter</button>
          )}
        </div>
      </div>
    </div>
  );
}

const tabs = [
  { key: "dashboard", label: "Tableau de bord" },
  { key: "quotes", label: "Devis" },
  { key: "invoices", label: "Factures" },
  { key: "clients", label: "Clients" },
  { key: "services", label: "Services" },
  { key: "settings", label: "Paramètres" },
];

function Shell() {
  const [tab, setTab] = useState("dashboard");
  const [profile, setProfile] = useState(null);
  useEffect(() => { (async () => {
    const { data } = await supabase.auth.getUser();
    setProfile(data?.user || null);
  })(); }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-black" />
            <div>
              <h1 className="font-semibold">CARRE Quotes CRM</h1>
              <p className="text-xs text-gray-500">Gérez devis & factures simplement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{profile?.email}</span>
            <button onClick={()=>supabase.auth.signOut()} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-lg">Se déconnecter</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <nav className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} className={classNames("px-3 py-1.5 rounded-lg text-sm border", tab===t.key ? "bg-black text-white border-black" : "bg-white hover:bg-gray-100")} onClick={()=>setTab(t.key)}>{t.label}</button>
          ))}
        </nav>
        {tab === "dashboard" && <Dashboard />}
        {tab === "services" && <Services />}
        {tab === "clients" && <Clients />}
        {tab === "quotes" && <Quotes />}
        {tab === "invoices" && <Invoices />}
        {tab === "settings" && <Settings />}
      </div>
    </div>
  );
}

function useCount(table) {
  const [count, setCount] = useState(0);
  useEffect(() => { (async () => {
    const { count } = await supabase.from(table).select("id", { count: "exact", head: true });
    setCount(count || 0);
  })(); }, [table]);
  return count;
}

function Dashboard() {
  const quotes = useCount("quotes");
  const invoices = useCount("invoices");
  const clients = useCount("clients");
  const services = useCount("services");
  return (
    <div className="grid md:grid-cols-4 gap-4">
      <StatCard title="Devis" value={quotes} />
      <StatCard title="Factures" value={invoices} />
      <StatCard title="Clients" value={clients} />
      <StatCard title="Services" value={services} />
    </div>
  );
}
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border p-4">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-3xl font-semibold mt-2">{value}</div>
    </div>
  );
}

function Services() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return;
    await supabase.from("services").insert({
      user_id: user.id, name: form.name, description: form.description, price: Number(form.price || 0),
    });
    setForm({ name: "", description: "", price: "" });
    load();
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border p-4">
        <h3 className="font-semibold mb-4">Nouveau service</h3>
        <form onSubmit={add} className="space-y-3">
          <input className="w-full border rounded-lg p-2" placeholder="Nom" value={form.name} onChange={(e)=>setForm(v=>({...v,name:e.target.value}))} required />
          <textarea className="w-full border rounded-lg p-2" placeholder="Description" value={form.description} onChange={(e)=>setForm(v=>({...v,description:e.target.value}))} />
          <input className="w-full border rounded-lg p-2" placeholder="Prix (€)" type="number" step="0.01" value={form.price} onChange={(e)=>setForm(v=>({...v,price:e.target.value}))} required />
          <button className="bg-black text-white rounded-lg px-4 py-2">Enregistrer</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border p-4">
        <h3 className="font-semibold mb-4">Catalogue</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Nom</th>
              <th>Prix</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {list.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="py-2 font-medium">{s.name}</td>
                <td>{currency(s.price)}</td>
                <td className="text-gray-600">{s.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Clients() {
  const [list, setList] = useState([]);
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", address: "" });
  const load = async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    setList(data || []);
  };
  useEffect(() => { load(); }, []);
  const add = async (e) => {
    e.preventDefault();
    const user = (await supabase.auth.getUser()).data.user;
    await supabase.from("clients").insert({ user_id: user.id, ...f });
    setF({ name: "", email: "", phone: "", company: "", address: "" });
    load();
  };
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border p-4">
        <h3 className="font-semibold mb-4">Nouveau client</h3>
        <form onSubmit={add} className="space-y-3">
          <input className="w-full border rounded-lg p-2" placeholder="Nom / Société" value={f.name} onChange={(e)=>setF(v=>({...v,name:e.target.value}))} required />
          <input className="w-full border rounded-lg p-2" placeholder="Email" type="email" value={f.email} onChange={(e)=>setF(v=>({...v,email:e.target.value}))} />
          <input className="w-full border rounded-lg p-2" placeholder="Téléphone" value={f.phone} onChange={(e)=>setF(v=>({...v,phone:e.target.value}))} />
          <input className="w-full border rounded-lg p-2" placeholder="Société" value={f.company} onChange={(e)=>setF(v=>({...v,company:e.target.value}))} />
          <textarea className="w-full border rounded-lg p-2" placeholder="Adresse" value={f.address} onChange={(e)=>setF(v=>({...v,address:e.target.value}))} />
          <button className="bg-black text-white rounded-lg px-4 py-2">Ajouter</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl border p-4">
        <h3 className="font-semibold mb-4">Liste des clients</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="py-2 font-medium">{c.name}</td>
                <td className="text-gray-600">{c.email}</td>
                <td className="text-gray-600">{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Quotes() {
  const [list, setList] = useState([]);
  const [services, setServices] = useState([]);
  const [clients, setClients] = useState([]);
  const [openNew, setOpenNew] = useState(false);

  const load = async () => {
    const { data: q } = await supabase.from("quotes").select("*, clients(name, email)").order("created_at", { ascending: false });
    setList(q || []);
  };
  const loadRefs = async () => {
    const [{ data: s }, { data: c }] = await Promise.all([
      supabase.from("services").select("*"),
      supabase.from("clients").select("*"),
    ]);
    setServices(s || []);
    setClients(c || []);
  };
  useEffect(() => { load(); loadRefs(); }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Devis</h3>
        <button className="bg-black text-white rounded-lg px-4 py-2" onClick={() => setOpenNew(true)}>Nouveau devis</button>
      </div>
      <table className="w-full text-sm bg-white rounded-2xl border overflow-hidden">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 px-3">N°</th>
            <th className="px-3">Client</th>
            <th className="px-3">Date</th>
            <th className="px-3">Statut</th>
            <th className="px-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {list.map((q) => (
            <tr key={q.id} className="border-t">
              <td className="py-2 px-3 font-medium">{q.number}</td>
              <td className="px-3">{q.clients?.name || "—"}</td>
              <td className="px-3">{new Date(q.date || q.created_at).toLocaleDateString()}</td>
              <td className="px-3 capitalize">{q.status}</td>
              <td className="px-3">{currency(q.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {openNew && (
        <NewQuoteModal onClose={() => { setOpenNew(false); load(); }} services={services} clients={clients} />
      )}
    </div>
  );
}

function NewQuoteModal({ onClose, services, clients }) {
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState([]);
  const [vatRate, setVatRate] = useState(20);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [currencyCode, setCurrencyCode] = useState("EUR");

  const addFromService = (serviceId) => {
    const s = services.find((x) => String(x.id) === String(serviceId));
    if (!s) return;
    setItems((xs) => [...xs, { service_id: s.id, name: s.name, description: s.description || "", quantity: 1, unit_price: Number(s.price || 0) }]);
  };
  const addBlank = () => setItems((xs) => [...xs, { name: "Ligne libre", description: "", quantity: 1, unit_price: 0 }]);
  const rm = (i) => setItems((xs) => xs.filter((_, idx) => idx !== i));
  const patch = (i, field, val) => setItems((xs) => xs.map((it, idx) => (idx === i ? { ...it, [field]: val } : it)));

  const subtotal = useMemo(() => items.reduce((a, it) => a + Number(it.quantity || 0) * Number(it.unit_price || 0), 0), [items]);
  const vat = useMemo(() => (subtotal - Number(discount || 0)) * (Number(vatRate || 0) / 100), [subtotal, discount, vatRate]);
  const total = useMemo(() => subtotal - Number(discount || 0) + vat, [subtotal, discount, vat]);

  const save = async () => {
    if (!clientId || items.length === 0) return alert("Sélectionnez un client et ajoutez des lignes.");
    const user = (await supabase.auth.getUser()).data.user;
    const year = new Date().getFullYear();
    const { data: counters } = await supabase.from("counters").select("quote_counter").eq("user_id", user.id).single();
    const nextCount = (counters?.quote_counter || 0) + 1;
    const number = `Q-${year}-${String(nextCount).padStart(4, "0")}`;

    const { data: q, error } = await supabase.from("quotes").insert({
      user_id: user.id, client_id: clientId, number, date: new Date().toISOString(),
      status: "draft", currency: currencyCode, vat_rate: Number(vatRate || 0), discount: Number(discount || 0),
      subtotal, vat_amount: vat, total, notes
    }).select("*").single();
    if (error) return alert(error.message);

    const rows = items.map((it) => ({ quote_id: q.id, service_id: it.service_id || null, name: it.name, description: it.description, quantity: Number(it.quantity || 0), unit_price: Number(it.unit_price || 0), total: Number(it.quantity || 0)*Number(it.unit_price || 0) }));
    const { error: e2 } = await supabase.from("quote_items").insert(rows);
    if (e2) return alert(e2.message);

    await supabase.from("counters").upsert({ user_id: user.id, quote_counter: nextCount }, { onConflict: "user_id" });

    alert("Devis enregistré.");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white max-w-3xl w-full rounded-2xl border shadow-lg">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Nouveau devis</h3>
          <button className="text-sm" onClick={onClose}>Fermer</button>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Client</label>
              <select className="w-full border rounded-lg p-2" value={clientId} onChange={(e)=>setClientId(e.target.value)}>
                <option value="">Choisir…</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">TVA %</label>
                <input className="w-full border rounded-lg p-2" type="number" value={vatRate} onChange={(e)=>setVatRate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Remise (€)</label>
                <input className="w-full border rounded-lg p-2" type="number" value={discount} onChange={(e)=>setDiscount(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Devise</label>
                <select className="w-full border rounded-lg p-2" value={currencyCode} onChange={(e)=>setCurrencyCode(e.target.value)}>
                  <option>EUR</option>
                  <option>MAD</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border">
            <div className="flex gap-2 mb-3">
              <select className="border rounded-lg p-2" onChange={(e)=>{ if(e.target.value){ addFromService(e.target.value); e.target.value=""; }}}>
                <option value="">Ajouter depuis Service…</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({currency(s.price)})</option>)}
              </select>
              <button className="border rounded-lg px-3" onClick={addBlank}>+ Ligne libre</button>
            </div>
            <table className="w-full text-sm bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 px-2">Libellé</th>
                  <th className="px-2">Qté</th>
                  <th className="px-2">PU</th>
                  <th className="px-2">Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 px-2">
                      <input className="w-full border rounded p-1 mb-1" value={it.name} onChange={(e)=>patch(i,"name",e.target.value)} />
                      <textarea className="w-full border rounded p-1 text-xs text-gray-600" rows={2} placeholder="Description (facultatif)" value={it.description} onChange={(e)=>patch(i,"description",e.target.value)} />
                    </td>
                    <td className="px-2 w-20"><input className="w-full border rounded p-1" type="number" value={it.quantity} onChange={(e)=>patch(i,"quantity",Number(e.target.value))} /></td>
                    <td className="px-2 w-28"><input className="w-full border rounded p-1" type="number" step="0.01" value={it.unit_price} onChange={(e)=>patch(i,"unit_price",Number(e.target.value))} /></td>
                    <td className="px-2 w-28">{currency(Number(it.quantity||0)*Number(it.unit_price||0), currencyCode)}</td>
                    <td className="px-2 w-14 text-right"><button className="text-red-600" onClick={()=>rm(i)}>Suppr</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Notes (visibles client)</label>
              <textarea className="w-full border rounded-lg p-2" rows={3} placeholder="Conditions, délais, validité, etc." value={notes} onChange={(e)=>setNotes(e.target.value)} />
            </div>
            <div className="bg-white rounded-2xl border p-3">
              <div className="flex justify-between text-sm">
                <span>Sous-total</span>
                <span>{currency(subtotal, currencyCode)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remise</span>
                <span>- {currency(discount, currencyCode)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TVA ({vatRate}%)</span>
                <span>{currency(vat, currencyCode)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-2">
                <span>Total</span>
                <span>{currency(total, currencyCode)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button className="px-4 py-2 rounded-lg border" onClick={onClose}>Annuler</button>
            <button className="px-4 py-2 rounded-lg bg-black text-white" onClick={save}>Enregistrer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Invoices() {
  const [list, setList] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [creatingFrom, setCreatingFrom] = useState("");

  const load = async () => {
    const { data } = await supabase.from("invoices").select("*, clients(name)").order("created_at", { ascending: false });
    setList(data || []);
  };
  const loadQuotes = async () => {
    const { data } = await supabase.from("quotes").select("id, number, total").eq("status", "accepted").order("created_at", { ascending: false });
    setQuotes(data || []);
  };
  useEffect(() => { load(); loadQuotes(); }, []);

  const createFromQuote = async () => {
    if (!creatingFrom) return;
    const user = (await supabase.auth.getUser()).data.user;
    const { data: q } = await supabase.from("quotes").select("*", { count: "exact" }).eq("id", creatingFrom).single();
    const { data: qi } = await supabase.from("quote_items").select("*").eq("quote_id", creatingFrom);

    const year = new Date().getFullYear();
    const { data: counters } = await supabase.from("counters").select("invoice_counter").eq("user_id", user.id).single();
    const nextCount = (counters?.invoice_counter || 0) + 1;
    const number = `F-${year}-${String(nextCount).padStart(4, "0")}`;

    const { data: inv, error } = await supabase.from("invoices").insert({
      user_id: user.id,
      quote_id: q.id,
      client_id: q.client_id,
      number,
      date: new Date().toISOString(),
      due_date: new Date(Date.now() + 1000*60*60*24*30).toISOString(),
      status: "sent",
      currency: q.currency,
      vat_rate: q.vat_rate,
      discount: q.discount,
      subtotal: q.subtotal,
      vat_amount: q.vat_amount,
      total: q.total,
      notes: q.notes || "",
    }).select("*").single();
    if (error) return alert(error.message);

    const rows = (qi || []).map((it) => ({
      invoice_id: inv.id,
      name: it.name,
      description: it.description,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total: it.total,
    }));
    const { error: e2 } = await supabase.from("invoice_items").insert(rows);
    if (e2) return alert(e2.message);

    await supabase.from("counters").upsert({ user_id: user.id, invoice_counter: nextCount }, { onConflict: "user_id" });

    alert("Facture créée depuis le devis.");
    setCreatingFrom("");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <select className="border rounded-lg p-2" value={creatingFrom} onChange={(e)=>setCreatingFrom(e.target.value)}>
          <option value="">Créer depuis devis accepté…</option>
          {quotes.map(q => <option key={q.id} value={q.id}>{q.number} — {currency(q.total)}</option>)}
        </select>
        <button className="bg-black text-white rounded-lg px-4 py-2" onClick={createFromQuote} disabled={!creatingFrom}>Créer</button>
      </div>

      <table className="w-full text-sm bg-white rounded-2xl border overflow-hidden">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 px-3">N°</th>
            <th className="px-3">Client</th>
            <th className="px-3">Date</th>
            <th className="px-3">Échéance</th>
            <th className="px-3">Statut</th>
            <th className="px-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {list.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="py-2 px-3 font-medium">{f.number}</td>
              <td className="px-3">{f.clients?.name || "—"}</td>
              <td className="px-3">{new Date(f.date).toLocaleDateString()}</td>
              <td className="px-3">{new Date(f.due_date).toLocaleDateString()}</td>
              <td className="px-3 capitalize">{f.status}</td>
              <td className="px-3">{currency(f.total, f.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Settings() {
  const [prefixQ, setPrefixQ] = useState("");
  const [prefixF, setPrefixF] = useState("");
  const [vatDefault, setVatDefault] = useState(20);
  const [importing, setImporting] = useState(false);
  useEffect(() => { (async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data } = await supabase.from("settings").select("*").eq("user_id", user.id).single();
    if (data) {
      setPrefixQ(data.quote_prefix || "");
      setPrefixF(data.invoice_prefix || "");
      setVatDefault(data.vat_default ?? 20);
    }
  })(); }, []);
  const save = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    await supabase.from("settings").upsert({ user_id: user.id, quote_prefix: prefixQ, invoice_prefix: prefixF, vat_default: Number(vatDefault || 20) }, { onConflict: "user_id" });
    alert("Paramètres enregistrés");
  };
  const importSeed = async () => {
    if (!confirm("Importer le catalogue de services (créera des doublons si déjà existants). Continuer ?")) return;
    setImporting(true);
    try {
      const user = (await supabase.auth.getUser()).data.user;
      const chunks = (arr, n) => arr.length ? [arr.slice(0, n), ...chunks(arr.slice(n), n)] : [];
      for (const pack of chunks(SEED_SERVICES, 10)) {
        const rows = pack.map((s) => ({ user_id: user.id, name: s.name, description: s.description, price: s.price }));
        const { error } = await supabase.from("services").insert(rows);
        if (error) throw error;
      }
      alert("Catalogue importé.");
    } catch (e) { alert(e.message); } finally { setImporting(false); }
  };
  return (
    <div className="bg-white rounded-2xl border p-4 max-w-xl space-y-4">
      <h3 className="font-semibold">Paramètres</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Préfixe devis</label>
          <input className="w-full border rounded-lg p-2" value={prefixQ} onChange={(e)=>setPrefixQ(e.target.value)} placeholder="ex: Q-2025-" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Préfixe factures</label>
          <input className="w-full border rounded-lg p-2" value={prefixF} onChange={(e)=>setPrefixF(e.target.value)} placeholder="ex: F-2025-" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">TVA par défaut (%)</label>
          <input className="w-full border rounded-lg p-2" type="number" value={vatDefault} onChange={(e)=>setVatDefault(e.target.value)} />
        </div>
        <div className="pt-2 border-t">
          <button className="bg-black text-white rounded-lg px-4 py-2" onClick={save}>Enregistrer</button>
          <button className="ml-2 border rounded-lg px-4 py-2 disabled:opacity-50" onClick={importSeed} disabled={importing}>{importing ? "Import…" : "Importer catalogue (seed)"}</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const session = useSession();
  return (
    <AuthGate>
      <Shell />
    </AuthGate>
  );
}
