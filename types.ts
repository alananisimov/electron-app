export type AppConfig = {
    Linux: { mode: string; dota_path: string; cs_path: string };
    Darwin: { mode: string; dota_path: string; cs_path: string };
    Windows_NT: { mode: string; dota_path: string; cs_path: string };
  };

export type ConfigData = {
  mode: string
  dota_path: string
  cs_path: string
}