const pool = require('./database');

async function seedFullData() {
    const conn = await pool.getConnection();
    try {
        console.log('🌟 Starting Full Data Seed...');

        // 0. Disable FK checks to clear existing data slightly safer (optional, but good for re-runs)
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['products', 'categories', 'product_variants', 'brands', 'reviews'];
        for (const t of tables) {
            await conn.query(`TRUNCATE TABLE ${t}`);
        }
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        // 1. Categories
        console.log('📦 Seeding Categories...');
        const categories = [
            { id: 1, name: 'Yemeni Honey', slug: 'yemeni-honey', description: 'Premium honey from Yemen', image: 'https://placehold.co/400x300/D4AF37/FFFFFF?text=Honey' },
            { id: 2, name: 'Coffee', slug: 'coffee', description: 'Authentic Yemeni Coffee', image: 'https://placehold.co/400x300/4B3621/FFFFFF?text=Coffee' },
            { id: 3, name: 'Gifts', slug: 'gifts', description: 'Special gift boxes', image: 'https://placehold.co/400x300/800000/FFFFFF?text=Gifts' },
            { id: 4, name: 'Spices', slug: 'spices', description: 'Traditional spices', image: 'https://placehold.co/400x300/E85D04/FFFFFF?text=Spices' }
        ];

        for (const cat of categories) {
            await conn.query(`
                INSERT INTO categories (id, name, slug, description, image_url) 
                VALUES (?, ?, ?, ?, ?)
            `, [cat.id, cat.name, cat.slug, cat.description, cat.image]);
        }

        // 2. Brands
        console.log('🏷️ Seeding Brands...');
        const brands = [
            { id: 1, name: 'Al-Malaki', slug: 'al-malaki' },
            { id: 2, name: 'Haraz Heritage', slug: 'haraz-heritage' },
            { id: 3, name: 'Sanaa Spices', slug: 'sanaa-spices' },
            { id: 4, name: 'Yemen Luxe', slug: 'yemen-luxe' }
        ];
        // Note: We need a brands table. If it doesn't exist, create it quickly or skip. 
        // Based on previous migration, we didn't explicitly create 'brands' in 'migrate_full_schema.js' 
        // (Wait, let me check migrate_full_schema.js... It did NOT create brands table. 
        // The legacy schema has it. I should probably add it or just skip brand_id for now 
        // OR dynamically create it here to be safe).

        // Let's create brands table mainly for completeness if missing
        await conn.query(`
            CREATE TABLE IF NOT EXISTS brands (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                slug VARCHAR(255),
                image_url VARCHAR(255)
            )
        `);

        for (const b of brands) {
            await conn.query('INSERT INTO brands (id, name, slug) VALUES (?, ?, ?)', [b.id, b.name, b.slug]);
        }

        // 3. Products & Variants
        console.log('🍯 Seeding Products...');
        const products = [
            {
                name: 'Royal Sidr Honey - Premium Grade',
                slug: 'royal-sidr-honey-premium',
                description: 'The finest Sidr honey from the ancient Sidr trees of Hadramaut. Known for its healing properties and rich flavor.',
                price: 89.99,
                category_id: 1, // Honey
                brand_id: 1,
                images: JSON.stringify(['https://placehold.co/600x600/D4AF37/FFFFFF?text=Royal+Sidr+1', 'https://placehold.co/600x600/D4AF37/FFFFFF?text=Royal+Sidr+2']),
                variants: [
                    { name: 'Small (250g)', price: 49.99, sku: 'SH-250' },
                    { name: 'Medium (500g)', price: 89.99, sku: 'SH-500' },
                    { name: 'Large (1kg)', price: 159.99, sku: 'SH-1000' }
                ]
            },
            {
                name: 'Haraz Mocha Coffee - Single Origin',
                slug: 'haraz-mocha-coffee',
                description: 'Premium single-origin coffee from the Haraz mountains. Notes of chocolate and berries.',
                price: 34.99,
                category_id: 2, // Coffee
                brand_id: 2,
                images: JSON.stringify(['https://placehold.co/600x600/4B3621/FFFFFF?text=Haraz+Coffee']),
                variants: [
                    { name: '250g - Medium Roast', price: 19.99, sku: 'HC-250-M' },
                    { name: '500g - Medium Roast', price: 34.99, sku: 'HC-500-M' },
                    { name: '1kg - Medium Roast', price: 64.99, sku: 'HC-1000-M' }
                ]
            },
            {
                name: 'Sana\'a Spice Blend',
                slug: 'sanaa-spice-blend',
                description: 'Authentic traditional spice mix for soups and rice dishes.',
                price: 15.99,
                category_id: 4, // Spices
                brand_id: 3,
                images: JSON.stringify(['https://placehold.co/600x600/E85D04/FFFFFF?text=Spice+Blend']),
                variants: [
                    { name: 'Standard Jar (200g)', price: 15.99, sku: 'SB-200' }
                ]
            },
            {
                name: 'Luxury Gift Box',
                slug: 'luxury-gift-box',
                description: 'A perfect combination of Honey and Coffee for your loved ones.',
                price: 120.00,
                category_id: 3, // Gifts
                brand_id: 4,
                images: JSON.stringify(['https://placehold.co/600x600/800000/FFFFFF?text=Gift+Box']),
                variants: []
            }
        ];

        for (const p of products) {
            const [res] = await conn.query(`
                INSERT INTO products (name, slug, description, price, category_id, brand_id, images, stock_quantity)
                VALUES (?, ?, ?, ?, ?, ?, ?, 100)
            `, [p.name, p.slug, p.description, p.price, p.category_id, p.brand_id, p.images]);

            const productId = res.insertId;

            if (p.variants && p.variants.length > 0) {
                for (const v of p.variants) {
                    await conn.query(`
                        INSERT INTO product_variants (product_id, name, price, sku, stock)
                        VALUES (?, ?, ?, ?, 50)
                    `, [productId, v.name, v.price, v.sku]);
                }
            }
        }

        console.log('✅ Full Data Seed Complete!');
        process.exit(0);

    } catch (error) {
        console.error('Seed failed:', error);
        process.exit(1);
    }
}

seedFullData();
