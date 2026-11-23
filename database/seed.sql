-- FarmFresh sample data (run after complete-setup.sql)
-- Prefer: cd backend && python -m app.seed  (reads ADMIN_* from .env)
USE farmer_cart;

INSERT INTO categories (name) VALUES
  ('Vegetables'),
  ('Fruits'),
  ('Dairy & Eggs'),
  ('Pantry')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO admins (username, email, hashed_password)
SELECT 'admin', 'admin@farmfresh.local',
  '$2b$12$PiZZRDK5FzGQguNsVyxvdO.gtQXlNNdZNlI2Dk0vYAxJHf.05e3aq'
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Organic Heirloom Tomatoes', 'Green Valley Farms',
  'Vine-ripened organic tomatoes, perfect for salads and sauces.', 4.99, 120,
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Vegetables'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Organic Heirloom Tomatoes');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Fresh Strawberries', 'Berry Brook Orchard',
  'Sweet, hand-picked strawberries from local fields.', 6.50, 80,
  'https://images.unsplash.com/photo-1464454709131-ffd692591ee5?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Fruits'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Fresh Strawberries');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Farm Eggs (Dozen)', 'Sunny Side Poultry',
  'Free-range brown eggs, collected daily.', 5.25, 50,
  'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Dairy & Eggs'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Farm Eggs (Dozen)');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Raw Wildflower Honey', 'Meadow Bee Co-op',
  'Unfiltered honey from regional wildflowers.', 12.00, 35,
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Pantry'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Raw Wildflower Honey');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Baby Spinach Bundle', 'Green Valley Farms',
  'Tender baby spinach, washed and ready to cook.', 3.75, 0,
  'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80', 'inactive'
FROM categories c WHERE c.name = 'Vegetables'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Baby Spinach Bundle');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Rainbow Carrots', 'Green Valley Farms',
  'Colorful sweet carrots harvested at peak crunch.', 3.49, 90,
  'https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Vegetables'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Rainbow Carrots');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Blueberry Pint', 'Berry Brook Orchard',
  'Plump blueberries, packed the same morning they were picked.', 7.25, 40,
  'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Fruits'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Blueberry Pint');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Whole Milk (1L)', 'Sunny Side Poultry',
  'Creamy farm-fresh whole milk from grass-fed cows.', 4.10, 60,
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Dairy & Eggs'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Whole Milk (1L)');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Sourdough Loaf', 'Meadow Bee Co-op',
  'Naturally leavened sourdough baked in a wood-fired oven.', 8.00, 18,
  'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Pantry'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Sourdough Loaf');

INSERT INTO products (category_id, name, farmer_name, description, price, available_quantity, image_url, status)
SELECT c.id, 'Hass Avocados (3 pack)', 'Berry Brook Orchard',
  'Ripe and ready Hass avocados for toast, salads, and bowls.', 5.99, 45,
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', 'active'
FROM categories c WHERE c.name = 'Fruits'
  AND NOT EXISTS (SELECT 1 FROM products p WHERE p.name = 'Hass Avocados (3 pack)');