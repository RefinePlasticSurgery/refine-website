// Test to verify team_members table creation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqckialwtkiaucxkesnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2tpYWx3dGtpYXVjeGtlc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjI0MDQsImV4cCI6MjA4NTU5ODQwNH0.OZ4qKvq0P8DEZfJmIQQpSz0bJBRx9uitsgJZXwystek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTeamTable() {
  console.log('Testing team_members table...\n');
  
  try {
    // Test if table exists and is accessible
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`❌ team_members table: ${error.message}`);
      console.log('You need to run the SQL migration to create the table.');
    } else {
      console.log(`✅ team_members table: Accessible (found ${data?.length || 0} records)`);
      
      // Check if we have sample data
      if (data && data.length > 0) {
        console.log('Sample team members found:');
        data.forEach(member => {
          console.log(`  - ${member.name} (${member.role})`);
        });
      } else {
        console.log('Table is empty - you can add team members through the admin panel.');
      }
    }
  } catch (err) {
    console.log(`❌ team_members table: Connection error - ${err.message}`);
  }
  
  console.log('\nTest completed.');
}

testTeamTable();