import { supabase } from './src/integrations/supabase/admin-client';

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test appointments table
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('*')
      .limit(1);
    
    console.log('Appointments table accessible:', !apptError);
    if (apptError) console.log('Appointments error:', apptError.message);
    
    // Test blog_posts table
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);
    
    console.log('Blog posts table accessible:', !blogError);
    if (blogError) console.log('Blog posts error:', blogError.message);
    
    // Test gallery_images table
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery_images')
      .select('*')
      .limit(1);
    
    console.log('Gallery table accessible:', !galleryError);
    if (galleryError) console.log('Gallery error:', galleryError.message);
    
    // Test admin_users table
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);
    
    console.log('Admin users table accessible:', !adminError);
    if (adminError) console.log('Admin users error:', adminError.message);
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

testConnection();