import { ServerConfig } from "../utils/ServerConfig";
import { Application } from "express-ws";
import * as https from "https";
import * as http from "http";
import * as fs from "fs";
import { WebSocket, Server } from "ws";
import { Id, make_id } from "../../model/utils/Id";
import { IServerApp } from "../application/ServerApp";
import { Client, IClient } from "./client/Client";

export interface IWebsocketListener {
  start_websocket_listener(): void;
}

export class WebsocketListener implements IWebsocketListener {
  private server: http.Server | https.Server;
  private port: number;
  private url: string;
  private socket: Server;

  /**
   * @param server_app Interface that gives access to an authenticator websocket handler for new connections.
   * @param app Express Application that the WebsocketServer will accept websocket connections from.
   */

  constructor(
    private readonly server_app: IServerApp,
    private readonly config: ServerConfig,
    private readonly app: Application
  ) {
    this.port = config.port;

    [this.server, this.port, this.url] = this.create_server();
    this.socket = new WebSocket.Server({ server: this.server });

    this.socket.on("connection", (ws) => {
      this.on_connect(ws);
    });
  }

  public start_websocket_listener() {
    this.server.listen(this.port, () => {
      console.log("Listening on " + this.url);
    });
  }

  private on_connect(ws: WebSocket) {
    let id: Id = make_id();
    console.log("Connected to " + id);
    let client: IClient = new Client(this.config, ws, id);
    this.server_app.auth_service.unauthenticated_client_tracker.attach_client(
      client
    );
  }

  /* SERVER CREATION */
  private create_server(): [http.Server | https.Server, number, string] {
    let server: http.Server | https.Server;
    let url: string;
    let port: number = this.config.port;
    let is_development: boolean = this.config.is_development;

    if (is_development) {
      server = this.create_local_server();
      url = "localhost:" + port.toString();
    } else {
      server = this.create_remote_server();
      url = "natehroylance.com:" + port.toString();
    }

    return [server, port, url];
  }

  private create_local_server(): http.Server {
    return http.createServer(this.app);
  }

  private create_remote_server(): https.Server {
    return https.createServer(
      {
        cert: fs.readFileSync(
          "/etc/letsencrypt/live/server.natehroylance.com/cert.pem"
        ),
        key: fs.readFileSync(
          "/etc/letsencrypt/live/server.natehroylance.com/privkey.pem"
        ),
      },
      this.app
    );
  }
}
