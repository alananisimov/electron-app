let fs = require('fs');
let os = require('os');

class Logger {
    constructor (path, enable) {
        this.path = path;
        this.enable = enable

        this.logo = [
           `███████╗ ███████╗ ███████╗ ██████╗  ███████╗ 
            ██╔════╝ ╚══███╔╝ ██╔════╝ ██╔══██╗ ██╔════╝ 
            █████╗     ███╔╝  █████╗   ██████╔╝ ███████╗
            ██╔══╝    ███╔╝   ██╔══╝   ██╔═══╝  ╚════██║
            ███████╗ ███████╗ ██║      ██║      ███████║
            ╚══════╝ ╚══════╝ ╚═╝      ╚═╝      ╚══════╝`
        ]
    }

    startSession() {
        if (!this.enable) { return; };

        let data = this.logo.join("\n");
        data += `\n\nLogSession\n - Time: ${Date()}\n - Start: SUCCESS`;
        data += `\n\nOS\n - Type: ${os.type()}\n - Release: ${os.release()}\n - Platform: ${os.platform()}\n\nOutput:\n`;
        
        try {
            fs.writeFileSync(this.path, data);
        }
        catch (err) {
            this.enable = false;
        }

        console.log(data);
    }

    writeLog(type, message) {
        if (!this.enable) { return; };
        
        let data = ` - ${type}: ${message}`;

        try {
            fs.appendFileSync(this.path, data + "\n");
        }
        catch (err) {
            this.enable = false;
        }

        console.log(data);
    }

    info(message) { this.writeLog("INFO", message) };
    warn(message) { this.writeLog("WARN", message) };
    error(message) { this.writeLog("ERROR", message) };
    debug(message) { this.writeLog("DEBUG", message) };
}

module.exports = Logger;