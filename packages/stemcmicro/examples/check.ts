// import { assert, expect } from "chai";
import assert from "assert";
import { RenderConfig, UndeclaredVars } from "../src/api/api";
import { SyntaxKind } from "../src/parser/parser";
import { munge } from "./munge";
import { render_as_string } from "./render_as_string";

export interface CheckConfig extends Partial<RenderConfig> {
    syntaxKind: SyntaxKind;
    allowUndeclaredVars: UndeclaredVars;
}

export function check(actual: string, expected: string, options: Partial<CheckConfig> = {}): void {
    const actualU = munge(actual, options);
    const actualS = render_as_string(actualU, options);
    assert.strictEqual(actualS, expected);
}
