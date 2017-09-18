# HTTP/2-slides

Slides for my HTTP(/2) session at Komma Board

## Slides

`npm install -g @infosupport/kc-cli`

`kc serve -o`


## Demo

### Vert.x HTTP/2 Server

* JDK 8
* VM options: -Xbootclasspath/p:alpn-boot-8.1.11.v20170118.jar

### Node.js HTTP/2 Server

molnarg/node-http2
* nvm use 6.11.3
* node http2-server.js

core node.js http2
* nvm use 8.5.0
* node --expose-http2 http2-core-server.js

### OkHttp HTTP/2 Client

* JDK 8
* VM options: -Xbootclasspath/p:alpn-boot-8.1.11.v20170118.jar
