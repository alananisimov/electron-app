import * as fs from 'fs';
import { exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { DownloaderHelper } from 'node-downloader-helper';
import { AppConfig, ConfigData } from './types';
import { logs } from './index';
import { chmodSync } from 'original-fs';

class ScriptManager {
  private path: string;
  private enable: boolean;
  private configName: string;
  private execName: string;
  private appConfig: Record<string, any>;
  private appPath: string;

  constructor(path: string, enable: boolean, configName: string, execName: string, appPath: string) {
    this.path = path;
    this.enable = enable;
    this.configName = configName;
    this.execName = execName;
    this.appPath = appPath;
  }

  execute(): void {
    fs.readFile(this.configName, 'utf8', (err, data) => {
      if (err) {
        logs.error(`Error reading ${this.configName}:` + err);
        return;
      }

      try {
        const config: ConfigData = JSON.parse(data);
        const { mode, dota_path, cs_path } = config;

        const escapedDotaPath = `${dota_path}`;
        const escapedCsPath = `${cs_path}`;
        chmodSync(path.join(this.path, this.execName), "755")
        const command = `${this.path}/${this.execName} -m "${mode}" -d "${escapedDotaPath}" -c "${escapedCsPath}" -s "${os.type()}"`;

        exec(command, {}, (error, stdout, stderr) => {
          if (error) {
            logs.error(`Error executing command: ${error}`);
            return;
          }

          logs.info(`Output: ${stdout}`);
          logs.error(`Errors: ${stderr}`);
        });
      } catch (err) {
        logs.error(`Error parsing ${this.configName}:` + err);
      }
    });
  }

  isConfig(): boolean {
    return fs.existsSync(path.join(process.cwd(), '/config.json'));
  }

  isExec(): boolean {
    const filesInCurrentDir = fs.readdirSync(this.path);
    return filesInCurrentDir.some((fileName) => fileName.includes('clearSystem'));
  }

  async executeScript(): Promise<void> {
    if (!this.isConfig()) {
      const config: AppConfig = {
        Linux: {
          mode: 'easy',
          dota_path: '~/.steam/steam/SteamApps/common/dota 2 beta',
          cs_path: '~/.steam/steam/SteamApps/common/Counter-Strike Global Offensive',
        },
        Darwin: {
          mode: 'easy',
          dota_path: '/Users/$USER/Library/Application Support/Steam/steamapps/common/dota 2 beta',
          cs_path: '/Users/$USER/Library/Application Support/Steam/steamapps/common/Counter-Strike Global Offensive',
        },
        Windows_NT: {
          mode: 'easy',
          dota_path: 'C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta',
          cs_path: 'C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive',
        },
      };
      const osType = os.type() as keyof AppConfig;
      this.saveConfig(0, config[osType]).finally(() => {
        this.execute();
      });
    }
    else {
      this.execute()
    }
  }

  async saveConfig(_: any, obj: ConfigData): Promise<void> {
    const json = JSON.stringify(obj);
    fs.writeFile(this.configName, json, 'utf8', (err) => {
      if (err) {
        logs.error(String(err));
      } else {

        logs.info('File written successfully\n');
        logs.info('The written file has the following contents:');
        logs.info(fs.readFileSync(this.configName, 'utf8'));
      }
    });
  }



  async getConfig(): Promise<ConfigData> {
    const config_data = {
      "mode": "easy",
      "dota_path": "C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta",
      "cs_path": "C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive"
    };

    try {
      const data = await fs.promises.readFile(this.configName, 'utf8');
      const config: ConfigData = JSON.parse(data);
      return { mode: config.mode, dota_path: config.dota_path, cs_path: config.cs_path };
    } catch (err) {
      logs.error(`Error reading ${this.configName}: ${err}`);
      return config_data;
    }
  }

  async downloadExec(): Promise<void> {
    const DownloadUrls: Record<string, string> = {
      Windows: 'https://launcher.ezfps.store/clearSystemWindows',
      Linux: 'https://launcher.ezfps.store/clearSystem',
      Darwin: 'https://launcher.ezfps.store/clearSystemMacos',
    };

    console.log(DownloadUrls[os.type()]);

    const filesInCurrentDir = fs.readdirSync(this.path);
    const clearSystemFile = filesInCurrentDir.find((fileName) => fileName.includes('clearSystem'));

    if (clearSystemFile) {
      logs.info(`Deleting existing '${clearSystemFile}'`);
      fs.unlinkSync(path.join(this.path, clearSystemFile));
    }

    const dl = new DownloaderHelper(DownloadUrls[os.type()], this.path);
    dl.on('end', async () => {
      logs.info('Exec file download completed');
      await this.executeScript();
    });

    dl.on('error', (err) => logs.error('Exec file download failed' + err));
    dl.start().catch((err) => logs.error(err));
  }
}

export default ScriptManager;
