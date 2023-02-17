const express = require("express");
import { Application } from "express-ws";
import * as path from "path";
import { ServerConfig } from "../utils/ServerConfig";

export interface IServerListener {
  start_server_listener(): void;
}

export class ServerListener implements IServerListener {
  constructor(
    private readonly config: ServerConfig,
    private readonly app: Application
  ) {}

  public start_server_listener() {
    this.app.use(express.static(path.join(__dirname, "../../../public")));
    this.app.get("/bundle.js", (request, response) => {
      response.sendFile(path.join(__dirname, "../../../dist/client/bundle.js"));
    });
  }
}
