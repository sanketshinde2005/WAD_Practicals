// Import Node.js built-in modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Using port 3003 to prevent conflict with other servers
const PORT = 3003; 

const server = http.createServer((req, res) => {
    
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Route 1: API Endpoint that provides Employee Data
    if (req.url === '/api/employees' && req.method === 'GET') {
        const filePath = path.join(__dirname, 'employees.json');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read employee data' }));
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
    
    // Handle 404
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Employee Directory Server running at http://localhost:${PORT}/`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/employees`);
});
