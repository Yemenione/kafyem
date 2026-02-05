const mysql = require('mysql2/promise');

async function testConnection() {
    const config = {
        host: 'srv924.hstgr.io',
        user: 'u704489955_yem',
        password: 'Yemenka123',
        database: 'u704489955_yem',
        port: 3306
    };

    try {
        console.log('Attempting to connect to new database...');
        const connection = await mysql.createConnection(config);
        console.log('Successfully connected to the database!');

        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in database:', rows.map(r => Object.values(r)[0]));

        await connection.end();
    } catch (error) {
        console.error('Connection failed:', error.message);
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Access denied. Checking if host is different...');
            // Try another known host if it failed
            try {
                const config2 = { ...config, host: 'srv1589.hstgr.io' };
                console.log('Attempting to connect to srv1589.hstgr.io...');
                const connection2 = await mysql.createConnection(config2);
                console.log('Successfully connected to srv1589.hstgr.io!');
                await connection2.end();
            } catch (e2) {
                console.error('Connection to srv1589 also failed:', e2.message);
            }
        }
    }
}

testConnection();
