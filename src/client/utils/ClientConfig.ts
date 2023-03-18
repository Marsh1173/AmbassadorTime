export interface ClientConfig {
  port: number;
  ws_url: () => string;
  is_development: boolean;
}

export const DEFAULT_CLIENT_CONFIG: ClientConfig = {
  port: 3001,
  ws_url: () => {
    const protocol = window.location.protocol.includes("https") ? "wss" : "ws";
    return `${protocol}://${location.host}:${DEFAULT_CLIENT_CONFIG.port}`;
  },
  is_development: false,
};

export const DEVELOPMENT_CLIENT_CONFIG: ClientConfig = {
  ...DEFAULT_CLIENT_CONFIG,
  port: 3000,
  ws_url: () => {
    return `ws://${location.host}`;
  },
  is_development: true,
};
