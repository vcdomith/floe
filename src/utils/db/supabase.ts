import { createBrowserClient } from "@supabase/ssr"
// import { createClient } from "@supabase/supabase-js"

export const dbConnect = () => {

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    return createBrowserClient(url, key)

}