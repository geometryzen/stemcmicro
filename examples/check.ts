// import { assert, expect } from "chai";
import assert from 'assert';
import { is_atom } from "math-expression-tree";
import { RenderConfig, UndeclaredVars } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { munge } from "./munge";
import { render_as_string } from "./render_as_string";

export interface CheckConfig extends Partial<RenderConfig> {
    syntaxKind: SyntaxKind;
    allowUndeclaredVars: UndeclaredVars;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check(actual: string, expected: string, options: Partial<CheckConfig> = {}): void {
    const actualU = munge(actual, options);
    const actualS = render_as_string(actualU, options);
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
