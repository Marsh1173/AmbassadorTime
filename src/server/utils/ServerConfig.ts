export interface ServerConfig {
  port: number;
  is_development: boolean;
  client_timeout_limit: number;
  database_path: string;
}

export const DEFAULT_SERVER_CONFIG: ServerConfig = {
  port: 3000,
  is_development: false,
  client_timeout_limit: 120,
  database_path: "src/server/database/",
};

export const DEV_SERVER_CONFIG: ServerConfig = {
  ...DEFAULT_SERVER_CONFIG,
  is_development: true,
};
