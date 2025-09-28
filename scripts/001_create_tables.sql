-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  team_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('AI', 'Web3', 'IoT', 'Other')),
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  voter_ip TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, voter_ip)
);

-- Create coupon_emails table for email collection
CREATE TABLE IF NOT EXISTS coupon_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Enable Row Level Security (RLS) for public access
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to projects
CREATE POLICY "Allow public read access to projects" ON projects
  FOR SELECT USING (true);

-- Create policies for public read access to votes (for counting)
CREATE POLICY "Allow public read access to votes" ON votes
  FOR SELECT USING (true);

-- Create policies for public insert access to votes
CREATE POLICY "Allow public insert access to votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Create policies for public insert access to coupon emails
CREATE POLICY "Allow public insert access to coupon_emails" ON coupon_emails
  FOR INSERT WITH CHECK (true);

-- Create policies for public read access to coupon emails (for admin dashboard)
CREATE POLICY "Allow public read access to coupon_emails" ON coupon_emails
  FOR SELECT USING (true);

-- Insert sample projects for the hackathon
INSERT INTO projects (title, description, team_name, category, image_url, demo_url, github_url) VALUES
('AI-Powered Local Tourism Guide', 'An AI chatbot that provides personalized tourism recommendations for Kesennuma, helping visitors discover hidden gems and local experiences while supporting the local economy.', 'Team Kesennuma AI', 'AI', '/placeholder.svg?height=300&width=400', 'https://demo.kesennuma-ai.com', 'https://github.com/team/kesennuma-ai'),
('Blockchain-Based Local Currency', 'A Web3 solution creating a local digital currency to keep economic value within Kesennuma, incentivizing local spending and supporting small businesses.', 'Kesennuma Coin', 'Web3', '/placeholder.svg?height=300&width=400', 'https://demo.kesennuma-coin.com', 'https://github.com/team/kesennuma-coin'),
('Smart Fishing Fleet Management', 'IoT sensors and AI analytics to optimize fishing operations, reduce fuel costs, and improve safety for Kesennuma''s fishing industry.', 'Ocean Tech Solutions', 'IoT', '/placeholder.svg?height=300&width=400', 'https://demo.ocean-tech.com', 'https://github.com/team/ocean-tech'),
('Community Connection Platform', 'A digital platform connecting elderly residents with younger volunteers for daily assistance, fostering intergenerational bonds and addressing aging population challenges.', 'Bridge Generations', 'Other', '/placeholder.svg?height=300&width=400', 'https://demo.bridge-gen.com', 'https://github.com/team/bridge-gen'),
('AR Cultural Heritage Experience', 'Augmented reality app that brings Kesennuma''s history to life, allowing visitors to experience historical events and cultural stories at key locations.', 'Heritage AR', 'AI', '/placeholder.svg?height=300&width=400', 'https://demo.heritage-ar.com', 'https://github.com/team/heritage-ar'),
('Decentralized Energy Trading', 'Web3 platform enabling residents to trade renewable energy credits, promoting sustainable energy adoption and creating new revenue streams.', 'Green Energy DAO', 'Web3', '/placeholder.svg?height=300&width=400', 'https://demo.green-dao.com', 'https://github.com/team/green-dao');
