const http2 = require('http2');
const fs = require('fs');

const options = {
    key: fs.readFileSync('./tls/ca.key'),
    cert: fs.readFileSync('./tls/ca.crt')
};

function fileExists(path) {
    return fs.existsSync(path);
}

function readFile(path) {
    return fs.readFileSync(path, 'utf-8');
}

function serve(stream, fileName, content) {
    const headers = {':status': 200};
    if (fileName && content) {
        const extension = fileName.substr(fileName.lastIndexOf('.') + 1);
        switch (extension) {
            case 'html':
                headers['Content-Type'] = 'text/html';
                /*stream.pushStream({':path': '/script.js'}, pushStream => {
                    pushStream.respond({':status': 200, 'Content-Type': 'application/json'});
                    pushStream.end(readFile('./static-files/script.js'));
                });*/
                break;
            case 'css':
                headers['Content-Type'] = 'text/css';
                break;
            case 'js':
                headers['Content-Type'] = 'application/javascript';
                break;
        }
    }
    stream.respond(headers);
    stream.end(content);
}

function requestHandler(stream, headers) {
    const pathPseudoHeader = headers[':path'];
    if (pathPseudoHeader === '/')
        serve(stream, 'index.html', readFile('./static-files/index.html'));
    else {
        const fileName = `${pathPseudoHeader}`;
        const path = `./static-files/${pathPseudoHeader}`;
        if (fileExists(path))
            serve(stream, fileName, readFile(path));
        else
            serve(stream);
    }
}

const server = http2.createSecureServer(options);
server.on('stream', requestHandler);
server.listen(8443);
