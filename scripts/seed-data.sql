-- Seed data for NCAS Grant Management System

-- Insert default admin user
INSERT INTO users (first_name, last_name, email, password_hash, role, organization, phone, status) VALUES
('System', 'Administrator', 'admin@ncas.org', '$2b$10$hash_placeholder', 'admin', 'NCAS', '+1-555-0001', 'approved'),
('Grant', 'Manager', 'manager@ncas.org', '$2b$10$hash_placeholder', 'grant_manager', 'NCAS', '+1-555-0002', 'approved'),
('John', 'Doe', 'john.doe@example.com', '$2b$10$hash_placeholder', 'applicant', 'Example University', '+1-555-0003', 'approved'),
('Jane', 'Smith', 'jane.smith@research.org', '$2b$10$hash_placeholder', 'applicant', 'Research Institute', '+1-555-0004', 'pending');

-- Insert sample grant applications
INSERT INTO grant_applications (
    applicant_id, title, category, amount, duration, description, objectives, 
    methodology, budget, timeline, impact, sustainability, status
) VALUES
(3, 'AI-Powered Healthcare Diagnostics', 'healthcare', 250000.00, '2-years', 
 'Development of an AI system for early disease detection using medical imaging.',
 'Create accurate diagnostic tools, Reduce healthcare costs, Improve patient outcomes',
 'Machine learning algorithms, Clinical trials, Data analysis',
 'Personnel: $150,000, Equipment: $75,000, Materials: $25,000',
 'Year 1: Development and testing, Year 2: Clinical trials and validation',
 'Improved diagnostic accuracy by 30%, Cost reduction of 20%',
 'Licensing to healthcare providers, Ongoing maintenance contracts',
 'pending'),
(3, 'Sustainable Energy Storage Solutions', 'environment', 180000.00, '18-months',
 'Research into next-generation battery technology for renewable energy storage.',
 'Develop efficient storage systems, Reduce environmental impact, Scale renewable energy',
 'Materials science research, Prototype development, Performance testing',
 'Personnel: $100,000, Materials: $50,000, Equipment: $30,000',
 'Months 1-6: Research, Months 7-12: Development, Months 13-18: Testing',
 'Increase energy storage efficiency by 40%, Reduce carbon footprint',
 'Technology transfer to industry partners, Patent licensing',
 'approved');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(3, 'Application Submitted', 'Your grant application "AI-Powered Healthcare Diagnostics" has been submitted successfully.', 'success'),
(3, 'Application Approved', 'Congratulations! Your grant application "Sustainable Energy Storage Solutions" has been approved.', 'success'),
(4, 'Account Pending', 'Your account is pending admin approval. You will be notified once approved.', 'info');
