CREATE DATABASE IF NOT EXISTS farmer_cart CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE IF NOT EXISTS farmer_cart_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'admin'@'localhost' IDENTIFIED BY 'admin123';
CREATE USER IF NOT EXISTS 'admin'@'127.0.0.1' IDENTIFIED BY 'admin123';

GRANT ALL PRIVILEGES ON farmer_cart.* TO 'admin'@'localhost';
GRANT ALL PRIVILEGES ON farmer_cart.* TO 'admin'@'127.0.0.1';
GRANT ALL PRIVILEGES ON farmer_cart_test.* TO 'admin'@'localhost';
GRANT ALL PRIVILEGES ON farmer_cart_test.* TO 'admin'@'127.0.0.1';
FLUSH PRIVILEGES;