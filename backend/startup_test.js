const http = require('http');
const port = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('HOSTINGER ENVIRONMENT TEST: SUCCESS\n');
});

server.listen(port, () => {
    console.log(`Test server running at port ${port}`);
});
