const http = require('http');
const port = process.env.PORT || 5000;

console.log('--- MINIMAL INDEX STARTING v1.0.2 ---');

const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.url}`);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('MINIMAL INDEX v1.0.2: SUCCESS\n');
});

server.listen(port, () => {
    console.log(`Server running at port ${port}`);
});
