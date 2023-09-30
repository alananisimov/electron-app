let fs = require("fs");
let exec = require("child_process").exec;
let os = require("os");
let path = require("path");
const { DownloaderHelper } = require("node-downloader-helper");
class ScriptManager {
  constructor(path, enable, configName, execName) {
    this.path = path;
    this.enable = enable;
    this.configName = configName;
    this.execName = execName;
  }
  execute() {
    fs.readFile(this.configName, "utf8", (err, data) => {
      if (err) {
        global.logs.error(`Error reading ${this.configName}:`, err);
        return;
      }

      try {
        const config = JSON.parse(data);
        const { mode, dota_path, cs_path } = config;

        const escapedDotaPath = `${dota_path}`;
        const escapedCsPath = `${cs_path}`;

        const command = `${process.cwd()}/${this.execName
          } -m "${mode}" -d "${escapedDotaPath}" -c "${escapedCsPath}"`;

        exec(command, (error, stdout, stderr) => {
          if (error) {
            global.logs.error(`Ошибка выполнения команды: ${error}`);
            return;
          }

          global.logs.info(`Output: ${stdout}`);

          global.logs.error(`Errors: ${stderr}`);
        });
      } catch (err) {
        global.logs.error(`Error parsing ${this.configName}:`, err);
      }
    });
  }
  isConfig() {
    if (fs.existsSync(path.join(process.cwd(), "/config.json"))) {
      return true;
    } else {
      return false;
    }
  }
  isExec() {
    const filesInCurrentDir = fs.readdirSync(this.path);
    const clearSystemFile = filesInCurrentDir.find((fileName) =>
      fileName.includes("clearSystem")
    );
    if (clearSystemFile) {
      return true;
    } else {
      return false;
    }
  }
  async executeScript() {
    if (!this.isConfig()) {
      const config = {
        mode: "easy",
        dota_path: "C:/Program Files (x86)/Steam/steamapps/common/dota 2 beta",
        cs_path:
          "C:/Program Files (x86)/Steam/steamapps/common/Counter-Strike Global Offensive",
      };
      await this.saveConfig(0, config);
    }

    this.execute();
  }

  saveConfig(_, obj) {
    const json = JSON.stringify(obj);
    fs.writeFile(this.configName, json, "utf8", (err) => {
      if (err) global.logs.error(err);
      else {
        global.logs.info("File written successfully\n");
        global.logs.info("The written has the following contents:");
        global.logs.info(fs.readFileSync(this.configName, "utf8"));
      }
    });
  }

  async downloadExec(is_exec) {
    let downloadUrl;
    switch (os.type()) {
      case "Linux":
        downloadUrl = "https://www.ezfps.store/clearSystem";
        break;
      case "Windows":
        downloadUrl = "https://launcher.ezfps.store/clearSystemWindows";
        break;
      case "Darwin":
        downloadUrl = "https://launcher.ezfps.store/clearSystemMacos";
        break;
      default:
        global.logs.error("Unsupported operating system");
        return;
    }

    const filesInCurrentDir = fs.readdirSync(this.path);
    const clearSystemFile = filesInCurrentDir.find((fileName) =>
      fileName.includes("clearSystem")
    );
    if (this.isExec()) {
      global.logs.info(
        `File '${clearSystemFile}' with 'clearSystem' in the name already exists in the current directory`
      );
      if (is_exec) {
        await this.executeScript();
      }
      return; // Завершаем выполнение функции, так как файл уже существует
    } else {
      const dl = new DownloaderHelper(downloadUrl, this.path);
      dl.on("end", async () => {
        global.logs.info("Exec file download Completed");
        if (is_exec) {
          await this.executeScript();
        }
      });

      dl.on("error", (err) =>
        global.logs.error("Exec file download Failed", err)
      );
      dl.start().catch((err) => global.logs.error(err));
    }
  }
}

module.exports = ScriptManager;
