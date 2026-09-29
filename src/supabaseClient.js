import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  'https://pwdizyaqcxjglrlovhpo.supabase.co'

const supabasePublishableKey =
  'sb_publishable_nKCSfmXefNmuuh2m1MPrNA_XGUb45iM'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)