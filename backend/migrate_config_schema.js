const pool = require('./database');

async function migrateConfigSchema() {
    const conn = await pool.getConnection();
    try {
        console.log('Migrating Config & SMTP tables...');

        // 1. Store Config (General settings, SMTP, etc.)
        await conn.query(`DROP TABLE IF EXISTS store_config`);
        console.log('Creating store_config table...');
        await conn.query(`
            CREATE TABLE store_config (
                \`key\` VARCHAR(255) PRIMARY KEY,
                value TEXT,
                type VARCHAR(50) DEFAULT 'text',
                \`group\` VARCHAR(50) DEFAULT 'general',
                description TEXT,
                isPublic BOOLEAN DEFAULT FALSE,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // 2. App Configs (System level)
        await conn.query(`DROP TABLE IF EXISTS app_configs`);
        console.log('Creating app_configs table...');
        await conn.query(`
            CREATE TABLE app_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                \`key\` VARCHAR(255) UNIQUE,
                value TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Seed Default Configs (Mocking what would be in the legacy DB)
        console.log('Seeding default configurations...');
        const configs = [
            { key: 'stripe_public_key', value: 'pk_test_TYooMQauvdEDq54NiTphI7jx', group: 'payment', isPublic: true },
            { key: 'stripe_secret_key', value: 'sk_test_PLACEHOLDER', group: 'payment', isPublic: false },
            { key: 'smtp_host', value: 'smtp.example.com', group: 'email', isPublic: false },
            { key: 'smtp_port', value: '587', group: 'email', isPublic: false },
            { key: 'smtp_user', value: 'user@example.com', group: 'email', isPublic: false },
            { key: 'smtp_pass', value: 'password', group: 'email', isPublic: false },
            { key: 'site_name', value: 'Yemeni Treasures', group: 'general', isPublic: true },
        ];

        for (const config of configs) {
            await conn.query(
                'INSERT INTO store_config (`key`, value, `group`, isPublic) VALUES (?, ?, ?, ?)',
                [config.key, config.value, config.group, config.isPublic]
            );
        }

        console.log('Config migration & seeding completed.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        conn.release();
        process.exit();
    }
}

migrateConfigSchema();
