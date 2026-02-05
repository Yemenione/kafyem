const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Attempting to connect to database via Prisma...');
        await prisma.$connect();
        console.log('Successfully connected to database!');

        // Test a simple query
        const count = await prisma.store_config.count();
        console.log('Number of config entries:', count);

    } catch (e) {
        console.error('Prisma connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
