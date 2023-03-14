const port: number = 3001;

export interface ClientConfig {
  url: string;
  is_development: boolean;
}

export const DEFAULT_CLIENT_CONFIG: ClientConfig = {
  url: `wss://${location.hostname}:` + port,
  is_development: false,
};

export const DEVELOPMENT_CLIENT_CONFIG: ClientConfig = {
  ...DEFAULT_CLIENT_CONFIG,
  url: `ws://${location.hostname}:` + port,
  is_development: true,
};
