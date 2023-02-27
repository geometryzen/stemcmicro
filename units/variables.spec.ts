import { assert } from "chai";
import { create_script_engine } from "../index";

describe("variables", function () {
    it("x", function () {
        const lines: string[] = [
            `x`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 1);
        assert.strictEqual(syms[0].key(), 'x');
        eng.release();
    });
    it("abs(x)", function () {
        const lines: string[] = [
            `abs(x)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 1);
        assert.strictEqual(syms[0].key(), 'x');
        eng.release();
    });
    it("cos(x)", function () {
        const lines: string[] = [
            `cos(x)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 1);
        assert.strictEqual(syms[0].key(), 'x');
        eng.release();
    });
    it("sin(x)", function () {
        const lines: string[] = [
            `sin(x)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 1);
        assert.strictEqual(syms[0].key(), 'x');
        eng.release();
    });
    it("x*sin(x)", function () {
        const lines: string[] = [
            `x*sin(x)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 1);
        assert.strictEqual(syms[0].key(), 'x');
        eng.release();
    });
    it("x*sin(y)", function () {
        const lines: string[] = [
            `x*sin(y)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 2);
        assert.strictEqual(syms[0].key(), 'x');
        assert.strictEqual(syms[1].key(), 'y');
        eng.release();
    });
    it("y*sin(x)", function () {
        const lines: string[] = [
            `y*sin(x)`
        ];
        const eng = create_script_engine();
        const { values } = eng.executeScript(lines.join('\n'));
        const syms = eng.freeVariables(values[0]);
        assert.strictEqual(syms.length, 2);
        assert.strictEqual(syms[0].key(), 'x');
        assert.strictEqual(syms[1].key(), 'y');
        eng.release();
    });
});
