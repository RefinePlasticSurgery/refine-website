// Test dashboard hook with real data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qqckialwtkiaucxkesnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2tpYWx3dGtpYXVjeGtlc25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMjI0MDQsImV4cCI6MjA4NTU5ODQwNH0.OZ4qKvq0P8DEZfJmIQQpSz0bJBRx9uitsgJZXwystek';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDashboardData() {
  console.log('Testing dashboard data with real database...\n');
  
  try {
    // Test appointments
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .select('*');
    
    console.log('Appointments:', appointments?.length || 0, 'records');
    if (apptError) console.log('Appointments error:', apptError.message);
    
    // Test blog posts
    const { data: blogPosts, error: blogError } = await supabase
      .from('blog_posts')
      .select('*');
    
    console.log('Blog Posts:', blogPosts?.length || 0, 'records');
    if (blogError) console.log('Blog posts error:', blogError.message);
    
    // Test gallery images
    const { data: galleryImages, error: galleryError } = await supabase
      .from('gallery_images')
      .select('*');
    
    console.log('Gallery Images:', galleryImages?.length || 0, 'records');
    if (galleryError) console.log('Gallery images error:', galleryError.message);
    
    // Calculate what dashboard would show
    const totalAppointments = appointments?.length || 0;
    const pendingAppointments = appointments?.filter(appt => appt.status === 'pending').length || 0;
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const thisMonthAppointments = appointments?.filter(appt => 
      new Date(appt.created_at) >= thisMonth
    ).length || 0;
    
    const totalInquiries = totalAppointments > 0 ? totalAppointments + 5 : 10;
    const conversionRate = Math.round((totalAppointments / totalInquiries) * 100);
    
    const totalBlogPosts = blogPosts?.length || 0;
    const publishedBlogPosts = blogPosts?.filter(post => post.status === 'published').length || 0;
    const totalGalleryImages = galleryImages?.length || 0;
    
    console.log('\n--- DASHBOARD STATS ---');
    console.log('Total Appointments:', totalAppointments);
    console.log('Pending Appointments:', pendingAppointments);
    console.log('This Month Appointments:', thisMonthAppointments);
    console.log('Conversion Rate:', conversionRate + '%');
    console.log('Total Blog Posts:', totalBlogPosts);
    console.log('Published Blog Posts:', publishedBlogPosts);
    console.log('Total Gallery Images:', totalGalleryImages);
    
  } catch (err) {
    console.error('Test failed:', err.message);
  }
  
  console.log('\nTest completed.');
}

testDashboardData();