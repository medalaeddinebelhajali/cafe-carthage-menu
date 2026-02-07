import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Debug: Log available environment variables
console.log('Available REACT_APP env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')))
console.log('supabaseUrl:', supabaseUrl)
console.log('supabaseKey:', supabaseKey ? '***' : 'undefined')

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please create a .env file with:\n' +
    'REACT_APP_SUPABASE_URL=your_supabase_url_here\n' +
    'REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here\n' +
    'Copy .env.example to .env and fill in your values.\n' +
    'Current values - URL: ' + (supabaseUrl || 'undefined') + ', Key: ' + (supabaseKey ? 'present' : 'undefined')
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
