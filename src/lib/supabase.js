import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zomqdavpyezkrsrjlltb.supabase.co";
const supabaseKey = " sb_publishable_vrSoVFZiSMgL2sFldnwQGw_0ZxuThk_";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);