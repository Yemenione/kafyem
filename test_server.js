const http = require('http');
const PORT = process.env.PORT || 5000;

console.log('=== SIMPLE DIAGNOSTIC SERVER ===');
console.log('Node Version:', process.version);
console.log('Port:', PORT);
console.log('Time:', new Date().toISOString());

const server = http.createServer((req, res) => {
    console.log('Request:', req.url);

    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    res.end(JSON.stringify({
        status: 'WORKING',
        message: 'Backend is alive!',
        url: req.url,
        method: req.method,
        node: process.version,
        time: new Date().toISOString()
    }));
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

server.on('error', (err) => {
    console.error('Server error:', err);
});
