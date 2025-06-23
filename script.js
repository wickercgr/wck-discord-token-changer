const Discord = require('discord.js-selfbot-v13');
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { JsonDatabase } = require("wio.db");
const database = new JsonDatabase({ databasePath: "./database.json" });

const util = require('util');
const origConsoleLog = console.log;

console.log = function () {
    const now = new Date();
    const options = {
        timeZone: 'Europe/Istanbul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const formattedDate = chalk.rgb(51, 255, 153)('[' + now.toLocaleString('tr-TR', options) + ']');
    const args = Array.from(arguments);
    args.unshift(formattedDate);
    origConsoleLog.apply(console, args);
};

const time = Date.now();

console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(102, 255, 153)("Script made by wicker | ") + chalk.rgb(204, 255, 102)("https://l24.im/EzQ9hA"));

async function loginTokens() {
    const tokens = fs.readFileSync('input-accounts.txt', 'utf-8').split('\r\n').filter(Boolean).map(line => line.slice(line.indexOf(':') + 1));
    const passwords = fs.readFileSync('input-accounts.txt', 'utf-8').split('\r\n').filter(Boolean).map(line => line.split(':')[0]);
    let completedCount = -1;
    let completedprocess = 0;

    function formatMemory(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    setInterval(async function () {
        process.title = ` WCK-TOKEN-CHANGER | Total Completed Accounts: ` + completedprocess + `/${tokens.length}` + ` | Memory Usage: ${formatMemory(process.memoryUsage().heapUsed)}`;
    }, 1000)

    for (let i = 0; i < tokens.length; i++) {

        setTimeout(async () => {

                const client = new Discord.Client({
                    checkUpdate: false
                });
                try {
                    await client.login(tokens[i]);
                } catch (error) {
                    console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(213, 128, 255)("Token invalid, switch to next account.") + chalk.rgb(204, 255, 102)(" {" + i + "}"));
                    completedprocess++;
                    return;
                }


                let newPassword = database.get("password");
                let oldPassword = passwords[i];

                // Örnek kullanım:
                try {
                    await client.user.setPassword(oldPassword, newPassword);
                    console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(102, 255, 153)(`${client.user.username}` + " change process completed.") + chalk.rgb(204, 255, 102)(" {" + i + "}"));
                    let newTokenPasswordFormat = `${newPassword}:${client.token}`;

                    fs.appendFileSync('output-accounts.txt', `${newTokenPasswordFormat}\n`);

                    completedCount++;
                    completedprocess++;
                } catch {
                    let passwordrepair = `INVALID_PASSWORD:${client.token}`;

                    fs.appendFileSync('output-accounts.txt', `${passwordrepair}\n`);
                    console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(213, 128, 255)("Password invalid, switch to next account.") + chalk.rgb(204, 255, 102)(" {" + i + "}"));
                }

                if (completedCount === tokens.length) {
                    console.log("");
                    console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(204, 255, 102)("All accounts succesfully completed."));
                }

            // Math.floor(Math.random() * (5000 - 1500 + 1)) + 1500; // 2000 ile 7000 arasında

        }, i * 2750);
    }
}

loginTokens();

process.on('unhandledRejection', err => {
    console.log(err);
});