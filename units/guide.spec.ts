import { assert } from "chai";
import { createScriptEngine } from "../index";
import { parseScript } from "../src/scanner/parse_script";

describe("guide", function () {
    xit("Experiment 001", function () {
        // In this experiment we see if expansion of sin(z) can be guided.
        // We don't start out with i being the unit imaginary number.
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        const engine = createScriptEngine({ dependencies: [], useDefinitions: true });

        const { trees, errors } = parseScript(lines.join('\n'));
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(errors.length, 0);

        const treeOne = trees[0];

        assert.strictEqual(engine.renderAsSExpr(treeOne), "(= z (+ x (* i y)))");
        assert.strictEqual(engine.renderAsInfix(treeOne), "z=x+i*y");

        // Perhaps valueOf here?
        const valueOne = engine.transform(treeOne);

        assert.strictEqual(engine.renderAsSExpr(valueOne), "()");
        assert.strictEqual(engine.renderAsInfix(valueOne), "()");

        const treeTwo = trees[1];

        assert.strictEqual(engine.renderAsSExpr(treeTwo), "(sin z)");
        assert.strictEqual(engine.renderAsInfix(treeTwo), "sin(z)");

        const valueTwo = engine.transform(treeTwo);

        assert.strictEqual(engine.renderAsSExpr(valueTwo), "(+ (* (cos x) (sin (* i y))) (* (cos (* i y)) (sin x)))");
        assert.strictEqual(engine.renderAsInfix(valueTwo), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");

        engine.release();
    });
    xit("Experiment 002", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        const engine = createScriptEngine({
            dependencies: [],
            useDefinitions: true
        });

        const { trees, errors } = parseScript(lines.join('\n'));
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(errors.length, 0);

        const treeOne = trees[0];

        assert.strictEqual(engine.renderAsSExpr(treeOne), "(= z (+ x (* i y)))");
        assert.strictEqual(engine.renderAsInfix(treeOne), "z=x+i*y");

        const valueOne = engine.transform(treeOne);

        assert.strictEqual(engine.renderAsSExpr(valueOne), "()");
        assert.strictEqual(engine.renderAsInfix(valueOne), "()");

        const treeTwo = trees[1];

        assert.strictEqual(engine.renderAsSExpr(treeTwo), "(sin z)");
        assert.strictEqual(engine.renderAsInfix(treeTwo), "sin(z)");

        const valueTwo = engine.transform(treeTwo);

        // The ordering isn't very predictable.
        assert.strictEqual(engine.renderAsSExpr(valueTwo), "(+ (* (cos x) (sin (* i y))) (* (cos (* i y)) (sin x)))");
        // Why isn't the imaginary unit being ordered after the symbols?
        assert.strictEqual(engine.renderAsInfix(valueTwo), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");

        engine.release();
    });
    it("Experiment 003", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        const engine = createScriptEngine({
            dependencies: [],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(sin (+ x (* i y)))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sin(x+i*y)");
        engine.release();
    });
    it("Experiment 004", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        // The problem is that we need the imaginary unit dependency.
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        // Setting autofactor=0 has no impact because we don't have anything to match cosh and sinh.
        // In any case, how would we know to replace cosh(y) with cos(y*i)?
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* (sin x) (cosh y)) (* (cos x) (sinh y) i))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sin(x)*cosh(y)+cos(x)*sinh(y)*i");
        engine.release();
    });
    it("Experiment 005", function () {
        const lines: string[] = [
            `autofactor=0`,
            `z = x + i * y`,
            `sin(z)`
        ];
        // The problem is that we need the imaginary unit dependency.
        const engine = createScriptEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsSExpr(values[0]), "(+ (* (sin x) (cosh y)) (* (cos x) (sinh y) i))");
        assert.strictEqual(engine.renderAsInfix(values[0]), "sin(x)*cosh(y)+cos(x)*sinh(y)*i");
        engine.release();
    });
});
