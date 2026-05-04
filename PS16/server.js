
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3002; 

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
};

const server = http.createServer((req, res) => {
    
    let urlPath = req.url === '/' ? '/index.html' : req.url;
    
    
    let filePath = path.join(__dirname, 'public', urlPath);
    
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') { 
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p>Sorry, that page does not exist!</p>', 'utf-8');
            } else { 
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Static Website Server running at: http://localhost:${PORT}/`);
    console.log(`Serving all files inside the 'public' directory.`);
});
