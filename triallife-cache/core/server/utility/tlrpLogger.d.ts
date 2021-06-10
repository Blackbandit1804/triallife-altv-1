export default class Logger {
    static log(message: string): void;
    static warning(message: string): void;
    static error(message: string): void;
    static info(message: string): void;
    static clearLastLine(): void;
    static passed(message: string): void;
    static failed(message: string): void;
}
