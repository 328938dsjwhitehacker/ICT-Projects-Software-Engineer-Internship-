import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xmlzzaenitmkkppreoic.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbHp6YWVuaXRta2twcHJlb2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzQzMzQsImV4cCI6MjA4MDgxMDMzNH0.oRJEGVHGkQH1pJqImgIsJ9ElL6SXrEXXh8sxzSxNLwM";

export const supabase = createClient(supabaseUrl, supabaseKey);


