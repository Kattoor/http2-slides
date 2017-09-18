const http2 = require('http2');
const fs = require('fs');

const options = {
    host: 'localhost',
    pathname: '/',
    port: 8081,
    key: fs.readFileSync('./tls/privatekey.pem'),
    ca: fs.readFileSync('./tls/certificate.crt'),
    rejectUnauthorized: false
};

const req = http2.get(options);

req.on('response', response => {
    response.pipe(process.stdout);
});
