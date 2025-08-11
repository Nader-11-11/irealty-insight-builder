import { z } from "zod";

export const UserSchema = z.object({ id: z.string(), email: z.string().email(), name: z.string().optional(), role: z.string().optional() });
export type User = z.infer<typeof UserSchema>;

export const TeamSchema = z.object({ id: z.string(), name: z.string(), plan: z.string().optional(), country: z.string().optional() });
export type Team = z.infer<typeof TeamSchema>;

export const PropertySchema = z.object({
  id: z.string(),
  team_id: z.string(),
  status: z.string(),
  sale_type: z.enum(["sale", "rent"]),
  price: z.number(),
  address: z.string(),
  lat: z.number(),
  lng: z.number(),
  district: z.string(),
  built_m2: z.number().optional(),
  plot_m2: z.number().optional(),
  beds: z.number().optional(),
  baths: z.number().optional(),
  year: z.number().optional(),
  features_json: z.any().optional(),
  media: z.array(z.string()).default([])
});
export type Property = z.infer<typeof PropertySchema>;

export const CollectionSchema = z.object({ id: z.string(), team_id: z.string(), name: z.string() });
export type Collection = z.infer<typeof CollectionSchema>;

export const CollectionItemSchema = z.object({ collection_id: z.string(), property_id: z.string() });

export const LeadSchema = z.object({
  id: z.string(),
  team_id: z.string(),
  source: z.string().optional(),
  name: z.string(),
  contact: z.string(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  desired_locations: z.array(z.string()).default([]),
  stage: z.string(),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});
export type Lead = z.infer<typeof LeadSchema>;

export const ValuationSchema = z.object({ id: z.string(), property_id: z.string(), estimate: z.number(), low: z.number(), high: z.number(), factors_json: z.any().optional(), created_at: z.string() });

export const MapIndexSchema = z.object({ id: z.string(), country: z.string(), muni: z.string(), district: z.string(), dataset_url: z.string().optional(), updated_at: z.string() });

export const NotificationSchema = z.object({ id: z.string(), user_id: z.string(), type: z.string(), payload_json: z.any(), read_at: z.string().nullable().optional() });

export const IntegrationSchema = z.object({ id: z.string(), team_id: z.string(), provider: z.string(), status: z.string(), creds_masked: z.string().optional(), last_sync_at: z.string().nullable().optional() });

export const SyncJobSchema = z.object({ id: z.string(), team_id: z.string(), provider: z.string(), status: z.string(), stats_json: z.any().optional(), started_at: z.string(), finished_at: z.string().nullable().optional() });

export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) => z.object({
  items: z.array(item),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
});
