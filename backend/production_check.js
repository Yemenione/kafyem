const http = require('http');
const { PrismaClient } = require('./prisma/client');

const port = process.env.PORT || 5000;

console.log('--- PRODUCTION DIAGNOSTIC START ---');
console.log('Node Version:', process.version);
console.log('Platform:', process.platform);

const server = http.createServer(async (req, res) => {
    if (req.url === '/health') {
        res.statusCode = 200;
        res.end('DIAGNOSTIC ALIVE\n');
        return;
    }

    let dbStatus = 'testing...';
    try {
        const prisma = new PrismaClient();
        await prisma.$connect();
        dbStatus = 'DATABASE CONNECTED ✅';
        await prisma.$disconnect();
    } catch (e) {
        dbStatus = `DATABASE ERROR ❌: ${e.message}`;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
        <h1>Yemeni Market Production Diagnostic</h1>
        <p><strong>Status:</strong> System Running</p>
        <p><strong>Node Version:</strong> ${process.version}</p>
        <p><strong>DB Status:</strong> ${dbStatus}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `);
});

server.listen(port, () => {
    console.log(`Diagnostic server running at port ${port}`);
});
