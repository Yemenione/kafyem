require('dotenv').config();
const pool = require('./database');

async function seed() {
    console.log('Seeding products...');
    const conn = await pool.getConnection();

    try {
        // Disable FK checks to allow clean slate
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');

        console.log('Clearing old data...');
        await conn.query('TRUNCATE TABLE order_items');
        await conn.query('TRUNCATE TABLE reviews');
        await conn.query('TRUNCATE TABLE product_variants');
        await conn.query('TRUNCATE TABLE products');
        await conn.query('TRUNCATE TABLE categories');

        await conn.query('SET FOREIGN_KEY_CHECKS = 1');

        // 1. Categories
        const categories = [
            { name: 'Honey', slug: 'honey', image: 'https://placehold.co/500x700/D4AF37/FFFFFF' },
            { name: 'Coffee', slug: 'coffee', image: 'https://placehold.co/500x700/4B3621/FFFFFF' },
            { name: 'Spices', slug: 'spices', image: 'https://placehold.co/500x700/E85D04/FFFFFF' },
            { name: 'Gifts', slug: 'gifts', image: 'https://placehold.co/500x700/800000/FFFFFF' }
        ];

        for (const cat of categories) {
            await conn.query('INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)', [cat.name, cat.slug, cat.image]);
        }
        console.log('Categories seeded.');

        // Get Category IDs
        const [catRows] = await conn.query('SELECT id, name FROM categories');
        const catMap = {};
        catRows.forEach(c => catMap[c.name] = c.id);

        // 2. Products
        const products = [
            {
                name: "Sidr Honey (Royal)",
                category_id: catMap['Honey'],
                price: 150.00,
                description: "Premium Royal Sidr Honey from Do'an Valley.",
                images: JSON.stringify(["https://placehold.co/500x700/D4AF37/FFFFFF?text=Royal+Sidr"]),
                is_featured: true
            },
            {
                name: "Yemeni Coffee (Mocha)",
                category_id: catMap['Coffee'],
                price: 45.00,
                description: "Authentic Yemeni Mocha beans, medium roast.",
                images: JSON.stringify(["https://placehold.co/500x700/4B3621/FFFFFF?text=Mocha+Beans"]),
                is_featured: true
            },
            {
                name: "Sidr Leaves Powder",
                category_id: catMap['Spices'],
                price: 25.00,
                description: "Organic Sidr leaves powder for health and beauty.",
                images: JSON.stringify(["https://placehold.co/500x700/3A5A40/FFFFFF?text=Sidr+Leaves"]),
                is_featured: false
            },
            {
                name: "White Honey",
                category_id: catMap['Honey'],
                price: 200.00,
                compare_at_price: 220.00,
                description: "Rare white honey from the mountains of Yemen.",
                images: JSON.stringify(["https://placehold.co/500x700/F0E68C/333333?text=White+Honey"]),
                is_featured: true
            },
            {
                name: "Saffron Spices",
                category_id: catMap['Spices'],
                price: 85.00,
                description: "Premium grade saffron threads.",
                images: JSON.stringify(["https://placehold.co/500x700/E63946/FFFFFF?text=Saffron"]),
                is_featured: false
            },
            {
                name: "Silver Jewelry Box",
                category_id: catMap['Gifts'],
                price: 350.00,
                description: "Handcrafted silver box from Sana'a.",
                images: JSON.stringify(["https://placehold.co/500x700/C0C0C0/333333?text=Silver+Box"]),
                is_featured: false
            }
        ];

        for (const p of products) {
            await conn.query(
                'INSERT INTO products (name, category_id, price, compare_at_price, description, images, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.name, p.category_id, p.price, p.compare_at_price || null, p.description, p.images, p.is_featured]
            );
        }
        console.log('Products seeded.');

        // 3. Variants for Royal Sidr Honey
        const [honeyRows] = await conn.query('SELECT id FROM products WHERE name = "Sidr Honey (Royal)"');
        if (honeyRows.length > 0) {
            const honeyId = honeyRows[0].id;
            const variants = [
                { name: "250g Jar", price: 85.00, sku: "SIDR-250" },
                { name: "500g Jar", price: 150.00, sku: "SIDR-500" },
                { name: "1kg Premium Box", price: 280.00, sku: "SIDR-1KG" }
            ];
            for (const v of variants) {
                await conn.query(
                    'INSERT INTO product_variants (product_id, name, price, sku, is_active) VALUES (?, ?, ?, ?, 1)',
                    [honeyId, v.name, v.price, v.sku]
                );
            }
            console.log('Variants seeded for Sidr Honey.');
        }

    } catch (e) {
        console.error("Seeding failed:", e);
    } finally {
        conn.release();
        process.exit();
    }
}

seed();
