import { ServerConfig } from "../utils/ServerConfig";
import { ServerApp } from "./ServerApp";

export const ServerStarter = (config: ServerConfig) => {
  try {
    new ServerApp(config);
  } catch (err) {
    console.error("Could not initialize server app.");
    console.error(err);
    process.exitCode = 1;
  }
};
