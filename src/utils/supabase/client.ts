import { createClient } from "@supabase/supabase-js";

export const client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export const clientv1 = createClient(
  process.env.SUPABASE_URL_v1!,
  process.env.SUPABASE_ANON_KEY_v1!,
);
