const mysql = require('mysql2/promise');

async function test(label, user, password, database) {
    const config = {
        host: 'srv924.hstgr.io',
        user: user,
        password: password,
        database: database,
        port: 3306
    };
    try {
        console.log(`Testing ${label} (${user} / ${database})...`);
        const connection = await mysql.createConnection(config);
        console.log(`✅ SUCCESS: ${label}`);
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables:', rows.map(r => Object.values(r)[0]));
        await connection.end();
        return true;
    } catch (e) {
        console.log(`❌ FAILED: ${label} - ${e.message}`);
        return false;
    }
}

async function main() {
    // Combination 1: New DB with guessed password
    await test('New DB Guess 1', 'u704489955_yem', 'Yemenka123', 'u704489955_yem');

    // Combination 2: New DB with original password
    await test('New DB Guess 2', 'u704489955_yem', 'Yemkaf123', 'u704489955_yem');

    // Combination 3: Original credentials (to check IP whitelist)
    await test('Original DB', 'u704489955_yemkaf', 'Yemkaf123', 'u704489955_yemkaf');
}

main();
