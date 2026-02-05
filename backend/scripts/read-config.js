const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const configs = await prisma.store_config.findMany();
        console.log('--- Store Configuration ---');
        configs.forEach(c => {
            // Mask secret keys for security in output if they appear sensitive
            const value = c.key.includes('secret') ? '********' : c.value;
            console.log(`${c.key}: ${value}`);
        });
    } catch (error) {
        console.error('Error reading config:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
