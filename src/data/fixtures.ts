import type { Property, Lead, Collection } from "@/schemas";

export type DB = {
  users: any[];
  teams: any[];
  team_members: any[];
  properties: Property[];
  collections: Collection[];
  collection_items: { collection_id: string; property_id: string }[];
  leads: Lead[];
  valuations: any[];
  map_indexes: any[];
  notifications: any[];
  integrations: { id: string; team_id: string; provider: string; status: string; creds_masked?: string; last_sync_at?: string | null; }[];
  sync_jobs: { id: string; team_id: string; provider: string; status: string; stats_json?: any; started_at: string; finished_at?: string | null }[];
  subplots: { id: string; team_id: string; polygon: number[][] }[];
};

const teamId = "team_1";

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const fixtures: DB = {
  users: [{ id: "user_1", email: "agent@example.com", name: "Agent Smith", role: "admin" }],
  teams: [{ id: teamId, name: "Barcelona Realty", plan: "trial", country: "ES" }],
  team_members: [{ team_id: teamId, user_id: "user_1", role: "admin" }],
  properties: range(20).map((i) => ({
    id: `prop_${i + 1}`,
    team_id: teamId,
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "draft" : "sold",
    sale_type: i % 2 === 0 ? "sale" : "rent",
    price: 250000 + i * 10000,
    address: `Carrer de Exemple ${i + 1}, Barcelona`,
    lat: 41.38 + Math.random() * 0.05,
    lng: 2.15 + Math.random() * 0.05,
    district: ["Eixample", "Gràcia", "Sants-Montjuïc"][i % 3],
    built_m2: 80 + i * 2,
    plot_m2: 0,
    beds: 2 + (i % 3),
    baths: 1 + (i % 2),
    year: 1990 + (i % 25),
    features_json: { elevator: i % 2 === 0, balcony: i % 3 === 0 },
    media: [],
  })),
  collections: [
    { id: "col_1", team_id: teamId, name: "Hot Leads Tour" },
    { id: "col_2", team_id: teamId, name: "Penthouse" },
    { id: "col_3", team_id: teamId, name: "Investments" },
  ],
  collection_items: [
    { collection_id: "col_1", property_id: "prop_1" },
    { collection_id: "col_1", property_id: "prop_2" },
    { collection_id: "col_2", property_id: "prop_3" },
  ],
  leads: range(10).map((i) => ({
    id: `lead_${i + 1}`,
    team_id: teamId,
    source: ["web", "idealista", "walk-in"][i % 3],
    name: `Lead ${i + 1}`,
    contact: `+34 600 000 ${100 + i}`,
    budget_min: 200000,
    budget_max: 600000,
    desired_locations: ["Eixample", "Gràcia"].slice(0, (i % 2) + 1),
    stage: ["new", "contacted", "qualified", "offer", "won", "lost"][i % 6],
    tags: ["buyer"],
    notes: i % 2 === 0 ? "Looking for balcony" : "",
  })),
  valuations: [{ id: "val_1", property_id: "prop_1", estimate: 420000, low: 400000, high: 440000, factors_json: { condition: "good" }, created_at: new Date().toISOString() }],
  map_indexes: [{ id: "map_1", country: "ES", muni: "Barcelona", district: "all", dataset_url: "", updated_at: new Date().toISOString() }],
  notifications: [],
  integrations: [
    { id: "int_idealista", team_id: teamId, provider: "Idealista ILC", status: "Not configured" },
    { id: "int_fotocasa", team_id: teamId, provider: "Fotocasa API", status: "Not configured" },
    { id: "int_habitaclia", team_id: teamId, provider: "Habitaclia API", status: "Not configured" },
  ],
  sync_jobs: [
    { id: "job_1", team_id: teamId, provider: "Idealista ILC", status: "running", stats_json: { count: 10 }, started_at: new Date().toISOString(), finished_at: null },
    { id: "job_2", team_id: teamId, provider: "Fotocasa API", status: "success", stats_json: { count: 120 }, started_at: new Date(Date.now()-3600e3).toISOString(), finished_at: new Date().toISOString() },
    { id: "job_3", team_id: teamId, provider: "Habitaclia API", status: "failed", stats_json: { count: 3 }, started_at: new Date(Date.now()-7200e3).toISOString(), finished_at: new Date(Date.now()-7100e3).toISOString() },
  ],
  subplots: [],
};
