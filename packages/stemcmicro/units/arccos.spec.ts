import assert from "assert";
import { create_script_context } from "../src/runtime/script_engine";

describe("arccos", function () {
    it("arccos(1)", function () {
        const lines: string[] = [`arccos(1)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "0");
        assert.strictEqual(engine.renderAsInfix(values[0]), "0");
        engine.release();
    });
    it("cos(arccos(x))", function () {
        const lines: string[] = [`cos(arccos(x))`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "x");
        assert.strictEqual(engine.renderAsInfix(values[0]), "x");
        engine.release();
    });
    it("arccos(-x)", function () {
        const lines: string[] = [`arccos(-x)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ pi (* -1 (arccos x)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "pi-arccos(x)");
        engine.release();
    });
    it("sin(arccos(x))", function () {
        const lines: string[] = [`sin(arccos(x))`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(1-x**2)**(1/2)");
        engine.release();
    });
    it("sin(arccos(x))", function () {
        const lines: string[] = [`sin(arccos(x))`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "(1-x**2)**(1/2)");
        engine.release();
    });
    it("derivative(arccos(x),x)", function () {
        const lines: string[] = [`derivative(arccos(x),x)`];
        const engine = create_script_context({
            useDerivativeShorthandLowerD: true
        });
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "-1/((1-x**2)**(1/2))");
        engine.release();
    });
    it("integral(arccos(x),x)", function () {
        const lines: string[] = [`integral(arccos(x),x)`];
        const engine = create_script_context({});
        const { values } = engine.executeScript(lines.join("\n"));
        assert.strictEqual(engine.renderAsInfix(values[0]), "x*arccos(x)-(1-x**2)**(1/2)");
        engine.release();
    });
});
