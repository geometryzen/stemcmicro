import { PrintHandler } from "./ExtensionEnv";

export class NoopPrintHandler implements PrintHandler {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    print(...items: string[]): void {
        console.log("NoopPrintHandler.print", items);
        // Do nothing
    }
}
