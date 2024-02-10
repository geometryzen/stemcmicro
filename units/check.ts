import { assert } from "chai";
import { infix } from "./infix";
import { munge } from "./munge";

export function check(actual: string, expected: string): void {
    const actualU = munge(actual);
    assert.strictEqual(infix(actualU), expected);
}
