-- Create team_members table for real team data
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    bio TEXT,
    qualifications TEXT,
    specialties TEXT[], -- Array of specialties
    image_url TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS team_members_active_idx ON team_members (is_active);
CREATE INDEX IF NOT EXISTS team_members_order_idx ON team_members (order_index);

-- Enable Row Level Security
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Team members are viewable by everyone" 
    ON team_members FOR SELECT 
    USING (true);

CREATE POLICY "Team members can be inserted by admins" 
    ON team_members FOR INSERT 
    WITH CHECK (EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid() 
        AND admin_users.role = 'admin'
    ));

CREATE POLICY "Team members can be updated by admins" 
    ON team_members FOR UPDATE 
    USING (EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid() 
        AND admin_users.role = 'admin'
    ));

CREATE POLICY "Team members can be deleted by admins" 
    ON team_members FOR DELETE 
    USING (EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.id = auth.uid() 
        AND admin_users.role = 'admin'
    ));

-- Insert sample team data
INSERT INTO team_members (name, role, bio, qualifications, specialties, order_index) VALUES
('Dr. Donald Madekwe', 'Plastic Reconstructive and Aesthetic Surgeon', 'Board-Certified Plastic Surgeon with over 15 years of experience specializing in reconstructive and aesthetic procedures. Dr. Madekwe is renowned for his expertise in complex reconstructive surgeries and has helped thousands of patients achieve their desired outcomes.', 'MBChB, FWACS, FICS', ARRAY['Reconstructive Surgery', 'Aesthetic Surgery', 'Burn Reconstruction', 'Hand Surgery'], 1),
('Dr. Andrew Onyino', 'Plastic Surgeon', 'Specialized plastic surgeon with expertise in facial and body contouring procedures. Dr. Onyino brings innovative techniques and personalized care to every patient consultation.', 'MBChB, FWACS', ARRAY['Facial Procedures', 'Body Contouring', 'Breast Surgery', 'Liposuction'], 2)
ON CONFLICT DO NOTHING;