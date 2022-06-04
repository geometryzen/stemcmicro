import { assert } from "chai";
import { create_engine, render_as_infix, render_as_sexpr, transform } from "../index";
import { FOCUS_EXPANDING } from "../src/env/ExtensionEnv";
import { scan_source_text } from "../src/scanner/scan_source_text";

describe("guide", function () {
    it("Experiment 001", function () {
        // In this experiment we see if expansion of sin(z) can be guided.
        // We don't start out with i being the unit imaginary number.
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        const engine = create_engine({ dependencies: [], useDefinitions: true });
        const $ = engine.$;

        const { trees, errors } = scan_source_text(lines.join('\n'));
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(errors.length, 0);

        const treeOne = trees[0];

        assert.strictEqual(render_as_sexpr(treeOne, $), "(= z (+ x (* i y)))");
        assert.strictEqual(render_as_infix(treeOne, $), "z=x+i*y");

        const valueOne = transform(treeOne, $);

        assert.strictEqual(render_as_sexpr(valueOne, $), "()");
        assert.strictEqual(render_as_infix(valueOne, $), "()");

        const treeTwo = trees[1];

        assert.strictEqual(render_as_sexpr(treeTwo, $), "(sin z)");
        assert.strictEqual(render_as_infix(treeTwo, $), "sin(z)");

        // We are in expanding mode, by default.
        $.setFocus(0);
        assert.strictEqual($.explicateMode, false, 'isExplicating');
        assert.strictEqual($.isExpanding(), false, 'isExpanding');
        assert.strictEqual($.isFactoring(), false, 'isFactoring');
        assert.strictEqual($.implicateMode, false, 'isImplicating');

        $.setFocus(FOCUS_EXPANDING);
        const valueTwo = transform(treeTwo, $);

        assert.strictEqual(render_as_sexpr(valueTwo, $), "(+ (* (cos x) (sin (* i y))) (* (cos (* i y)) (sin x)))");
        assert.strictEqual(render_as_infix(valueTwo, $), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");

        engine.release();
    });
    it("Experiment 002", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        // Now ensure that i is recognized as the complex unit imaginary number.
        const engine = create_engine({ useDefinitions: true });
        const $ = engine.$;

        const { trees, errors } = scan_source_text(lines.join('\n'));
        assert.strictEqual(trees.length, 2);
        assert.strictEqual(errors.length, 0);

        const treeOne = trees[0];

        assert.strictEqual(render_as_sexpr(treeOne, $), "(= z (+ x (* i y)))");
        assert.strictEqual(render_as_infix(treeOne, $), "z=x+i*y");

        const valueOne = transform(treeOne, $);

        assert.strictEqual(render_as_sexpr(valueOne, $), "()");
        assert.strictEqual(render_as_infix(valueOne, $), "()");

        const treeTwo = trees[1];

        assert.strictEqual(render_as_sexpr(treeTwo, $), "(sin z)");
        assert.strictEqual(render_as_infix(treeTwo, $), "sin(z)");

        // We are in expanding mode, by default.
        $.setFocus(0);
        assert.strictEqual($.explicateMode, false, 'isExplicating');
        assert.strictEqual($.isExpanding(), false, 'isExpanding');
        assert.strictEqual($.isFactoring(), false, 'isFactoring');
        assert.strictEqual($.implicateMode, false, 'isImplicating');

        $.setFocus(FOCUS_EXPANDING);
        const valueTwo = transform(treeTwo, $);

        // The ordering isn't very predictable.
        assert.strictEqual(render_as_sexpr(valueTwo, $), "(+ (* (cos x) (sin (* i y))) (* (cos (* i y)) (sin x)))");
        // Why isn't the imaginary unit being ordered after the symbols?
        assert.strictEqual(render_as_infix(valueTwo, $), "cos(x)*sin(i*y)+cos(i*y)*sin(x)");

        engine.release();
    });
    it("Experiment 003", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        const engine = create_engine({ useDefinitions: true });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_sexpr(values[0], $), "(sin (+ x (* i y)))");
        assert.strictEqual(render_as_infix(values[0], $), "sin(x+i*y)");
        engine.release();
    });
    it("Experiment 004", function () {
        const lines: string[] = [
            `z = x + i * y`,
            `sin(z)`
        ];
        // The problem is that we need the imaginary unit dependency.
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        // Setting autofactor=0 has no impact because we don't have anything to match cosh and sinh.
        // In any case, how would we know to replace cosh(y) with cos(y*i)?
        assert.strictEqual(render_as_sexpr(values[0], $), "(+ (* (sin x) (cosh y)) (* (cos x) (sinh y) i))");
        assert.strictEqual(render_as_infix(values[0], $), "sin(x)*cosh(y)+cos(x)*sinh(y)*i");
        engine.release();
    });
    it("Experiment 005", function () {
        const lines: string[] = [
            `autofactor=0`,
            `z = x + i * y`,
            `sin(z)`
        ];
        // The problem is that we need the imaginary unit dependency.
        const engine = create_engine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_sexpr(values[0], $), "(+ (* (sin x) (cosh y)) (* (cos x) (sinh y) i))");
        assert.strictEqual(render_as_infix(values[0], $), "sin(x)*cosh(y)+cos(x)*sinh(y)*i");
        engine.release();
    });
});
