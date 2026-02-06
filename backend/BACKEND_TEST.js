const http = require('http');
const PORT = process.env.PORT || 5000;

console.log('=== BACKEND TEST v1.0 ===');
console.log('Port:', PORT);

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(JSON.stringify({
        status: 'SUCCESS',
        message: 'Backend Test Working!',
        timestamp: new Date().toISOString(),
        node: process.version
    }));
});

server.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
});
