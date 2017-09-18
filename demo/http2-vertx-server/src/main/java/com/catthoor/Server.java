package com.catthoor;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Launcher;
import io.vertx.core.http.*;
import io.vertx.core.net.PemKeyCertOptions;

public class Server extends AbstractVerticle {

    public static void main(final String[] args) {
        Launcher.executeCommand("run", Server.class.getName());
    }

    private void startHttp1Server() {
        HttpServerOptions options1 = new HttpServerOptions()
                .setPort(8080)
                .setHost("localhost");

        HttpServer http1 = vertx.createHttpServer(options1);

        Handler<HttpServerRequest> http1Handler = httpServerRequest -> {
            switch (httpServerRequest.uri()) {
                case "/":
                    httpServerRequest.response().setStatusCode(302).putHeader("Location", "https://localhost:8443").end();
                    break;
            }
        };

        http1.requestHandler(http1Handler);
        http1.listen();
    }

    private void startHttp2Server() {
        HttpServerOptions options2 = new HttpServerOptions()
                .setPort(8443)
                .setHost("localhost")
                .setSsl(true)
                .setKeyCertOptions(new PemKeyCertOptions()
                        .setCertPath("tls/certificate.crt")
                        .setKeyPath("tls/privatekey.pem"))
                .setUseAlpn(true);

        HttpServer http2 = vertx.createHttpServer(options2);

        Handler<HttpServerRequest> http2Handler = httpServerRequest -> {
            switch (httpServerRequest.uri()) {
                case "/":
                    httpServerRequest.response()
                            .push(HttpMethod.GET, "/style2.css", ar -> ar.result().end("* { color: blue; }"));
                    new Thread(() -> {
                        try {
                            Thread.sleep((long) (1000));
                            httpServerRequest.response().setStatusCode(200).end(
                                    "<html><head>" +
                                            "<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">" +
                                            "<link rel=\"stylesheet\" type=\"text/css\" href=\"style2.css\">" +
                                            "</head><body>" +
                                            "<h1>test</h1>" +
                                            "</body></html>");
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }).start();
                    break;
                case "/style.css":
                    new Thread(() -> {
                        try { Thread.sleep((long) (0)); } catch (InterruptedException e) { e.printStackTrace(); }
                        httpServerRequest.response().setStatusCode(200).end("* { color: red; }");
                    }).start();
                    break;
            }
        };

        http2.requestHandler(http2Handler);
        http2.listen();
    }

    public void start(Future<Void> future) {
        startHttp1Server();
        startHttp2Server();
    }
}
