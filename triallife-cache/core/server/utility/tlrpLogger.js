import * as alt from 'alt-server';
import chalk from 'chalk';
export default class Logger {
    static log(message) {
        alt.log(`${chalk.blueBright('[3L:RP]')} ${chalk.whiteBright(message)}`);
    }
    static warning(message) {
        alt.log(`${chalk.blueBright('[3L:RP]')} ${chalk.yellowBright(message)}`);
    }
    static error(message) {
        alt.log(`${chalk.blueBright('[3L:RP]')} ${chalk.redBright(message)}`);
    }
    static info(message) {
        alt.log(`${chalk.blueBright('[3L:RP]')} ${chalk.blueBright(message)}`);
    }
    static clearLastLine() {
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(1);
    }
    static passed(message) {
        Logger.clearLastLine();
        alt.log(`${chalk.greenBright(`    ✔️  ${message}`)}`);
    }
    static failed(message) {
        Logger.clearLastLine();
        alt.log(`${chalk.redBright(`    ❌  ${message}`)}`);
    }
}
