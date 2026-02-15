// Simple test to check database connectivity
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqckialwtkiaucxkesnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2tpYWx3dGtpYXVjeGtlc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjI0MDQsImV4cCI6MjA4NTU5ODQwNH0.OZ4qKvq0P8DEZfJmIQQpSz0bJBRx9uitsgJZXwystek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log('Checking Supabase database tables...\n');
  
  // Check each table
  const tables = ['appointments', 'blog_posts', 'gallery_images', 'admin_users'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Accessible (found ${data?.length || 0} records)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: Connection error - ${err.message}`);
    }
  }
  
  console.log('\nTest completed.');
}

checkTables();