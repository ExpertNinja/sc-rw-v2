-- Insert sample users
INSERT INTO users (username, password, email, role_id, is_active, created_at, updated_at) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@sc.com', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ops', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operations@sc.com', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user1', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user@sc.com', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample path configs
INSERT INTO path_configs (unique_id, action, input_file_name, file_type, output_folder_path, description) VALUES
('1234abc', 'New', 'Customer_20230527010101.csv', 'PDF', 'SG/Retail/Customer', 'Sample path config');

-- Insert sample transfer logs
INSERT INTO transfer_logs (unique_id, action, input_file_name, file_type, output_folder_path, status) VALUES
('1234abc', 'New', 'Customer_20230527010101.csv', 'PDF', 'SG/Retail/Customer', 'COMPLETED');

-- Insert sample reports
INSERT INTO reports (name, description, file_path, file_type, status, date) VALUES
('KYC Report', 'Know Your Customer Report', '/reports/kyc.pdf', 'PDF', 'AVAILABLE', '2023-05-27'),
('AML Report', 'Anti-Money Laundering Report', '/reports/aml.pdf', 'PDF', 'AVAILABLE', '2023-05-27');

-- Insert sample groups
INSERT INTO groups (name, description) VALUES
('Wealth Compliance', 'Compliance reports group'),
('Wealth User Admin', 'User admin group');
