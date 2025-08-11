import { http, HttpResponse } from "msw";
import { fixtures, type DB } from "@/data/fixtures";

const LS_KEY = "mockdb";

function loadDB(): DB {
  const raw = localStorage.getItem(LS_KEY);
  if (raw) return JSON.parse(raw);
  localStorage.setItem(LS_KEY, JSON.stringify(fixtures));
  return JSON.parse(localStorage.getItem(LS_KEY)!);
}

function saveDB(db: DB) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export const handlers = [
  // User/Org
  http.post("/api/fetch_user_data", async () => {
    const db = loadDB();
    const user = db.users[0];
    const team = db.teams[0];
    return HttpResponse.json({ user, team });
  }),
  http.post("/api/save_user_data", async ({ request }) => {
    const db = loadDB();
    const data = await request.json();
    db.users[0] = { ...db.users[0], ...data };
    saveDB(db);
    return HttpResponse.json({ ok: true });
  }),
  http.post("/api/get_users_in_team", async () => {
    const db = loadDB();
    const users = db.users;
    return HttpResponse.json({ users });
  }),
  http.post("/api/fetch_subscription", async () => HttpResponse.json({ plan: "trial", days_left: 3 })),
  http.post("/api/fetch_user_notifications", async () => {
    const db = loadDB();
    return HttpResponse.json({ notifications: db.notifications });
  }),

  // Properties/Collections
  http.post("/api/fetch_properties", async () => {
    const db = loadDB();
    return HttpResponse.json({ properties: db.properties });
  }),
  http.post("/api/fetch_property", async ({ request }) => {
    const { id } = await request.json();
    const db = loadDB();
    const property = db.properties.find((p) => p.id === id);
    return HttpResponse.json({ property });
  }),
  http.post("/api/save_property", async ({ request }) => {
    const input = await request.json();
    const db = loadDB();
    const idx = db.properties.findIndex((p) => p.id === input.id);
    if (idx >= 0) db.properties[idx] = { ...db.properties[idx], ...input };
    else db.properties.push({ ...input, id: uid("prop") });
    saveDB(db);
    return HttpResponse.json({ ok: true });
  }),
  http.post("/api/fetch_team_portfolio_paginated", async ({ request }) => {
    const { page = 1, pageSize = 10 } = await request.json().catch(() => ({}));
    const db = loadDB();
    const start = (page - 1) * pageSize;
    const items = db.properties.slice(start, start + pageSize);
    return HttpResponse.json({ items, page, pageSize, total: db.properties.length });
  }),
  http.post("/api/fetch_collections", async () => {
    const db = loadDB();
    return HttpResponse.json({ collections: db.collections, items: db.collection_items });
  }),
  http.post("/api/save_collection", async ({ request }) => {
    const db = loadDB();
    const payload = await request.json();
    if (payload.action === "create") {
      const id = uid("col");
      db.collections.push({ id, team_id: db.teams[0].id, name: payload.name });
    } else if (payload.action === "add") {
      db.collection_items.push({ collection_id: payload.collection_id, property_id: payload.property_id });
    } else if (payload.action === "remove") {
      db.collection_items = db.collection_items.filter((ci) => !(ci.collection_id === payload.collection_id && ci.property_id === payload.property_id));
    }
    saveDB(db);
    return HttpResponse.json({ ok: true });
  }),

  // Leads
  http.post("/api/get_leads", async ({ request }) => {
    const { page = 1, pageSize = 10 } = await request.json().catch(() => ({}));
    const db = loadDB();
    const start = (page - 1) * pageSize;
    const items = db.leads.slice(start, start + pageSize);
    return HttpResponse.json({ items, page, pageSize, total: db.leads.length });
  }),

  // Map/Search
  http.post("/api/fetch_map_search_indexes", async () => {
    const db = loadDB();
    return HttpResponse.json({ indexes: db.map_indexes });
  }),
  http.post("/api/get_plots_by_bounds", async () => {
    const polygons = await (await fetch("/src/data/district_polygons.geojson")).json();
    return HttpResponse.json(polygons);
  }),
  http.post("/api/get_subplots_by_bounds", async () => {
    const db = loadDB();
    return HttpResponse.json({ subplots: db.subplots });
  }),
  http.post("/api/save_subplot_bounds", async ({ request }) => {
    const db = loadDB();
    const { polygon } = await request.json();
    db.subplots.push({ id: uid("subplot"), team_id: db.teams[0].id, polygon });
    saveDB(db);
    return HttpResponse.json({ ok: true });
  }),

  // Valuation/Analytics
  http.post("/api/get_valuation_conditions", async () => HttpResponse.json({
    conditions: { bathrooms_weight: 1.1, bedrooms_weight: 1.3, m2_weight: 1.5 },
  })),
  http.post("/api/fetch_historical_valuations", async () => HttpResponse.json({
    series: [
      { date: "2024-01-01", estimate: 390000 },
      { date: "2024-06-01", estimate: 405000 },
      { date: "2025-01-01", estimate: 420000 }
    ]
  })),
  http.post("/api/get_extra_features_schema", async () => HttpResponse.json({
    schema: { elevator: "boolean", balcony: "boolean", energy_label: "string" }
  })),
  http.post("/api/fetch_dashboard_analytics", async () => {
    const db = loadDB();
    return HttpResponse.json({
      leads: db.leads.length,
      properties: db.properties.length,
      collections: db.collections.length,
      syncJobs: db.sync_jobs.length,
      valuations: db.valuations.length,
    });
  }),
  http.post("/api/fetch_analytics", async () => {
    const db = loadDB();
    return HttpResponse.json({
      propertiesByStatus: Object.entries(db.properties.reduce((acc: any, p) => { acc[p.status] = (acc[p.status]||0)+1; return acc; }, {})),
      leadsByStage: Object.entries(db.leads.reduce((acc: any, l) => { acc[l.stage] = (acc[l.stage]||0)+1; return acc; }, {})),
      avgDom: 42,
    });
  }),

  // Integrations/Sync
  http.post("/api/fetch_integration_data", async () => {
    const db = loadDB();
    return HttpResponse.json({ integrations: db.integrations });
  }),
  http.post("/api/active_team_sync_jobs", async () => {
    const db = loadDB();
    return HttpResponse.json({ jobs: db.sync_jobs });
  }),
  http.post("/api/run_sync", async ({ request }) => {
    const { provider } = await request.json();
    const db = loadDB();
    db.sync_jobs.unshift({ id: uid("job"), team_id: db.teams[0].id, provider, status: "running", started_at: new Date().toISOString(), finished_at: null });
    saveDB(db);
    return HttpResponse.json({ ok: true });
  }),
];
