// Import core Node.js modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Using port 3001 so it doesn't conflict if your PS14 server is still running!
const PORT = 3001; 

const server = http.createServer((req, res) => {
    
    // Enable CORS to allow Live Server frontend to access this API
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Route 1: Product API Endpoint
    if (req.url === '/api/products' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'products.json');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read product data' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } 
    
    // Route 2: Serve the Front-end HTML
    else if (req.url === '/' || req.url === '/index.html') {
        const htmlPath = path.join(__dirname, 'index.html');
        
        fs.readFile(htmlPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Failed to load front-end page.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } 
    
    // Handle 404s
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Product Catalog Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api/products`);
});
