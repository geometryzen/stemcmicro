import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { infix } from "./infix";
import { munge } from "./munge";

export interface CheckConfig {
    syntaxKind: SyntaxKind;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function check(actual: string, expected: string, options: Partial<CheckConfig> = {}): void {
    const actualU = munge(actual, options);
    assert.strictEqual(infix(actualU), expected);
}
