export interface ClientConfig {
  url: string;
  is_development: boolean;
}

export const DEFAULT_CLIENT_CONFIG: ClientConfig = {
  url: `wss://${location.hostname}:3000`,
  is_development: false,
};

export const DEVELOPMENT_CLIENT_CONFIG: ClientConfig = {
  ...DEFAULT_CLIENT_CONFIG,
  url: `ws://${location.hostname}:3000`,
  is_development: true,
};
