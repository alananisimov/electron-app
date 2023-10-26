import { writeFileSync, appendFileSync } from 'fs';
import { type, release, platform } from 'os';

class Logger {
    private path: string;
    private enable: boolean;
    private readonly logo: string;

    constructor(path: string, enable: boolean) {
        this.path = path;
        this.enable = enable;

        this.logo =
            `
            ███████╗ ███████╗ ███████╗ ██████╗  ███████╗ 
            ██╔════╝ ╚══███╔╝ ██╔════╝ ██╔══██╗ ██╔════╝ 
            █████╗     ███╔╝  █████╗   ██████╔╝ ███████╗
            ██╔══╝    ███╔╝   ██╔══╝   ██╔═══╝  ╚════██║
            ███████╗ ███████╗ ██║      ██║      ███████║
            ╚══════╝ ╚══════╝ ╚═╝      ╚═╝      ╚══════╝
            `;

    }

    public startSession(): void {
        if (!this.enable) { return; }

        let data = this.logo;
        data += `\n\nLogSession\n - Time: ${new Date()}\n - Start: SUCCESS`;
        data += `\n\nOS\n - Type: ${type()}\n - Release: ${release()}\n - Platform: ${platform()}\n\nOutput:\n`;

        try {
            writeFileSync(this.path, data);
        }
        catch (err) {
            this.enable = false;
            console.error(err);
        }

        console.log(data);
    }

    private writeLog(type: string, message: string): void {
        if (!this.enable) { return; }

        let data = ` - ${type}: ${message}`;

        try {
            appendFileSync(this.path, data + "\n");
        }
        catch (err) {
            this.enable = false;
            console.error(err);
        }

        console.log(data);
    }

    public info(message: string): void { this.writeLog("INFO", message) };
    public warn(message: string): void { this.writeLog("WARN", message) };
    public error(message: string): void { this.writeLog("ERROR", message) };
    public debug(message: string): void { this.writeLog("DEBUG", message) };
}

export default Logger;
