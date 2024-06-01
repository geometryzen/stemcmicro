// import assert from 'assert';
import { nil, U } from "@stemcmicro/tree";
import { ExprEngineListener, UndeclaredVars } from "../src/api/api";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}
export interface MungeConfig {
    allowUndeclaredVars: UndeclaredVars;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function munge(sourceText: string, options: Partial<MungeConfig>): U {
    // TODO: Restore after monorepo refactoring
    return nil;
}
