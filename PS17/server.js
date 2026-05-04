
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3003; 

const server = http.createServer((req, res) => {
    
    
    res.setHeader('Access-Control-Allow-Origin', '*');

    
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
    
    
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Employee Directory Server running at http://localhost:${PORT}/`);
    console.log(`API Endpoint: http://localhost:${PORT}/api/employees`);
});
