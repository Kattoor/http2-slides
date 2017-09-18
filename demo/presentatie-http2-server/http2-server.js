const http2 = require('http2');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./tls/privatekey.pem'),
    cert: fs.readFileSync('./tls/certificate.crt')
};

function fileExists(path) {
    return fs.existsSync(path);
}

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function serve(res, fileName, content) {
    if (fileName && content) {
        const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
        switch (extension) {
            case 'html':
                res.setHeader('Content-Type', 'text/html');
                break;
            case 'css':
                res.setHeader('Content-Type', 'text/css');
                break;
            case 'js':
                res.setHeader('Content-Type', 'application/javascript');
                break;
        }
    }
    res.end(content);
}

function requestHandler(request, response) {
    if (request.url === '/')
        serve(response, 'index.html', readFile('./static-files/index.html'));
    else {
        const fileName = `${request.url}`;
        const path = `./static-files/${fileName}`;
        if (fileExists(path))
            serve(response, fileName, readFile(path));
        else
            serve(response);
    }
}

http2.createServer(options, requestHandler).listen(8081);
