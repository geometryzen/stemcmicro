import assert from "assert";
import { munge } from "./munge";
import { render_as_string } from "./render_as_string";

export interface CheckConfig {
    allowUndeclaredVars: "Err" | "Nil";
    format: "Ascii" | "Human" | "Infix" | "LaTeX" | "SExpr" | "SVG";
    language: "eigenmath" | "javascript" | "python";
    useCaretForExponentiation: boolean;
}

export function check(actual: string, expected: string, options: Partial<CheckConfig> = {}): void {
    const actualU = munge(actual, options);
    const actualS = render_as_string(actualU, options);
    assert.strictEqual(actualS, expected);
}
