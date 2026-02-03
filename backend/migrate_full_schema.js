const pool = require('./database');

async function migrateSchema() {
    const conn = await pool.getConnection();
    try {
        console.log('Starting full schema migration...');

        // Disable foreign key checks to allow dropping tables
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'categories', 'products', 'product_variants', 'customers',
            'addresses', 'orders', 'order_items', 'reviews', 'wishlists',
            'users' // Dropping the simple users table we made earlier in favor of customers
        ];

        for (const table of tables) {
            await conn.query(`DROP TABLE IF EXISTS ${table}`);
            console.log(`Dropped table ${table}`);
        }

        // 1. Categories (Hierarchical)
        console.log('Creating categories table...');
        await conn.query(`
            CREATE TABLE categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE,
                description TEXT,
                image_url VARCHAR(255),
                parent_id INT,
                is_active BOOLEAN DEFAULT TRUE,
                display_order INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        // 2. Customers (Replaces users)
        console.log('Creating customers table...');
        await conn.query(`
            CREATE TABLE customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255),
                phone VARCHAR(50),
                avatar VARCHAR(255),
                role ENUM('customer', 'admin') DEFAULT 'customer',
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Addresses
        console.log('Creating addresses table...');
        await conn.query(`
            CREATE TABLE addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                label VARCHAR(50),
                street_address TEXT NOT NULL,
                city VARCHAR(100) NOT NULL,
                state VARCHAR(100),
                country VARCHAR(100) NOT NULL,
                postal_code VARCHAR(20),
                phone VARCHAR(50),
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
            )
        `);

        // 4. Products (Extended)
        console.log('Creating products table...');
        await conn.query(`
            CREATE TABLE products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE,
                sku VARCHAR(100) UNIQUE,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                compare_at_price DECIMAL(10, 2),
                cost_price DECIMAL(10, 2),
                stock_quantity INT DEFAULT 0,
                images TEXT, -- JSON array of image URLs
                is_active BOOLEAN DEFAULT TRUE,
                is_featured BOOLEAN DEFAULT FALSE,
                brand_id INT,
                weight DECIMAL(10, 3),
                translations LONGTEXT, -- JSON for i18n
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
            )
        `);

        // 5. Product Variants
        console.log('Creating product_variants table...');
        await conn.query(`
            CREATE TABLE product_variants (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                name VARCHAR(255), -- e.g. "1kg" or "Small"
                sku VARCHAR(100) UNIQUE,
                price DECIMAL(10, 2) NOT NULL,
                stock INT DEFAULT 0,
                weight DECIMAL(10, 3),
                is_active BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        // 6. Orders
        console.log('Creating orders table...');
        await conn.query(`
            CREATE TABLE orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                customer_id INT,
                status VARCHAR(50) DEFAULT 'Processing',
                total_amount DECIMAL(10, 2) NOT NULL,
                subtotal DECIMAL(10, 2) NOT NULL,
                tax_total DECIMAL(10, 2) DEFAULT 0,
                shipping_cost DECIMAL(10, 2) DEFAULT 0,
                shipping_address TEXT, -- JSON or text
                payment_method VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
            )
        `);

        // 7. Order Items
        console.log('Creating order_items table...');
        await conn.query(`
            CREATE TABLE order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT,
                variant_id INT,
                product_name VARCHAR(255),
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
                FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL
            )
        `);

        // 8. Reviews
        console.log('Creating reviews table...');
        await conn.query(`
            CREATE TABLE reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_id INT NOT NULL,
                product_id INT NOT NULL,
                rating INT CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);

        console.log('Schema migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        conn.release();
        process.exit();
    }
}

migrateSchema();
