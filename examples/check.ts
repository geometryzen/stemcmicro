import { assert } from "chai";
import { is_atom } from "math-expression-tree";
import { UndeclaredVars } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { infix } from "./infix";
import { munge } from "./munge";

export interface CheckConfig {
    syntaxKind: SyntaxKind;
    allowUndeclaredVars: UndeclaredVars;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check(actual: string, expected: string, options: Partial<CheckConfig> = {}): void {
    const actualU = munge(actual, options);
    const actualS = infix(actualU);
    if (actualS !== expected) {
        if (is_atom(actualU)) {
            // eslint-disable-next-line no-console
            console.log(actualU.type);
        }
        // eslint-disable-next-line no-console
        console.log(`${actualU}`);
    }
    assert.strictEqual(actualS, expected);
}
