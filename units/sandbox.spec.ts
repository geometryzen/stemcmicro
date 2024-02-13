import { assert } from "chai";
import { Stack } from "../src/env/Stack";

describe("sandbox", function () {
    it("001", function () {
        const stack = new Stack<string>();
        assert.strictEqual(stack.length, 0);
        stack.push("a");
        stack.push("b");
        stack.push("c");
        stack.push("d");
        stack.push("e");
        assert.strictEqual(stack.length, 5);
        assert.strictEqual(stack.getAt(0), "a");
        assert.strictEqual(stack.getAt(1), "b");
        assert.strictEqual(stack.getAt(2), "c");
        assert.strictEqual(stack.getAt(3), "d");
        assert.strictEqual(stack.getAt(4), "e");
        stack.rotateL(3);
        assert.strictEqual(stack.getAt(0), "a");
        assert.strictEqual(stack.getAt(1), "b");
        assert.strictEqual(stack.getAt(2), "d");
        assert.strictEqual(stack.getAt(3), "e");
        assert.strictEqual(stack.getAt(4), "c");
        stack.rotateR(3);
        assert.strictEqual(stack.getAt(0), "a");
        assert.strictEqual(stack.getAt(1), "b");
        assert.strictEqual(stack.getAt(2), "c");
        assert.strictEqual(stack.getAt(3), "d");
        assert.strictEqual(stack.getAt(4), "e");
    });
});
