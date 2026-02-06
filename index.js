/**
 * Root Diagnostic Entry Point (v1.0.2)
 */
const http = require('http');
const port = process.env.PORT || 5000;

console.log('--- ROOT DIAGNOSTIC STARTING v1.0.2 ---');

const server = http.createServer((req, res) => {
    console.log(`Request: ${req.url}`);
    if (req.url === '/health') {
        res.statusCode = 200;
        res.end('OK - ROOT DIAGNOSTIC ALIVE v1.0.2\n');
        return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(`
    <h1>Yemeni Market Backend Root</h1>
    <p>Status: <b>Ready</b></p>
    <p>Version: 1.0.2</p>
    <p>Timestamp: ${new Date().toISOString()}</p>
    <hr>
    <p><a href="/api/test">Go to Backend API Test</a></p>
  `);
});

server.listen(port, () => {
    console.log(`Diagnostic server running at port ${port}`);
});

// Optional: Require backend but commented out for pure diagnostic test first
// require('./backend/server.js');
