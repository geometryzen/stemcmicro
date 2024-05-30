import assert from "assert";
import { JsAtom } from "@stemcmicro/atoms";
import { StackU } from "../src/env/StackU";

class Widget extends JsAtom {
    readonly type = "widget";
    #refCount = 1;
    constructor() {
        super("Widget");
    }
    get refCount(): number {
        return this.#refCount;
    }
    override addRef(): void {
        this.#refCount++;
    }
    override release(): void {
        this.#refCount--;
    }
}

describe("refcount", function () {
    it("stack", function () {
        const stack = new StackU();
        assert.strictEqual(typeof stack === "object", true);
        assert.strictEqual(stack.refCount, 1);

        stack.addRef();
        assert.strictEqual(stack.refCount, 2);
        stack.release();
        assert.strictEqual(stack.refCount, 1);
        stack.release();
        assert.strictEqual(stack.refCount, 0);
    });
    it("widget", function () {
        const widget = new Widget();
        assert.strictEqual(typeof widget === "object", true);
        assert.strictEqual(widget.refCount, 1);
        widget.addRef();
        assert.strictEqual(widget.refCount, 2);
        widget.release();
        assert.strictEqual(widget.refCount, 1);
        widget.release();
        assert.strictEqual(widget.refCount, 0);
    });
    it("stack should release owned elements", function () {
        const stack = new StackU();
        const widget = new Widget();
        stack.push(widget);
        widget.release();
        assert.strictEqual(widget.refCount, 1);
        stack.release();
        assert.strictEqual(widget.refCount, 0);
    });
    it("stack should release owned elements", function () {
        const stack = new StackU();
        {
            const widget = new Widget();
            stack.push(widget);
            widget.release();
        }
        const widget = stack.pop() as Widget;
        assert.strictEqual(stack.length, 0);
        stack.release();
        assert.strictEqual(widget.refCount, 1);
    });
});
