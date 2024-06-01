import { PrintHandler } from "../env/ExtensionEnv";

/**
 * A PrintHandler that maintains backwards compatibility by modifying defs.
 */
export class DefaultPrintHandler implements PrintHandler {
    public readonly prints: string[] = [];
    print(...items: string[]): void {
        this.prints.push(...items);
    }
}
