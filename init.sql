CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `imageUrl` varchar(500) DEFAULT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

INSERT INTO `products` (`name`, `slug`, `description`, `price`, `category`, `stock`, `imageUrl`) VALUES
('MacBook Pro 16"', 'macbook-pro-16', 'Apple M3 Max chip, 36GB RAM, 1TB SSD. Perfect for developers and creative professionals.', 2499.99, 'Electronics', 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
('Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise canceling wireless headphones with premium sound quality.', 399.99, 'Electronics', 30, 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400'),
('iPhone 15 Pro', 'iphone-15-pro', 'Titanium design with A17 Pro chip. 6.1-inch Super Retina XDR display.', 999.99, 'Electronics', 25, 'https://images.unsplash.com/photo-1592286927505-25f428e27100?w=400'),
('Herman Miller Aeron Chair', 'herman-miller-aeron', 'Ergonomic office chair with advanced PostureFit SL support.', 1395.00, 'Furniture', 8, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400'),
('LG UltraWide Monitor 34"', 'lg-ultrawide-34', '34-inch curved WQHD display (3440 x 1440) with HDR10 support.', 599.99, 'Electronics', 12, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'),
('Ergonomic Office Desk', 'ergonomic-office-desk', 'Height-adjustable standing desk with electric motor.', 449.99, 'Furniture', 10, 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=400'),
('Wireless Keyboard & Mouse', 'wireless-keyboard-mouse', 'Professional wireless combo with long battery life.', 79.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400'),
('LED Desk Lamp', 'led-desk-lamp', 'Modern LED lamp with adjustable brightness.', 39.99, 'Home & Garden', 35, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400');