import { assert } from "chai";
import {
    create_engine,
    create_env,
    define_std_operators,
    execute_script,
    execute_std_definitions,
    render_as_infix,
    render_as_latex,
    render_as_sexpr
} from "../index";

describe("example", function () {
    it("Using the Engine object for convenience.", function () {
        const lines: string[] = [
            `a/b`
        ];
        const engine = create_engine();
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        assert.strictEqual(render_as_infix(values[0], $), "a/b");
        assert.strictEqual(render_as_sexpr(values[0], $), "(* a (power b -1))");
        assert.strictEqual(render_as_latex(values[0], $), "\\frac{a}{b}");
        engine.release();
    });
    it("Using the Environment directly for fine-grained control.", function () {
        const lines: string[] = [
            `a/b`
        ];

        const $ = create_env();

        $.resetSymTab();

        $.clearOperators();

        define_std_operators($);

        $.buildOperators();

        execute_std_definitions($);

        const { values } = execute_script(lines.join('\n'), $);

        assert.strictEqual(render_as_infix(values[0], $), "a/b");
        assert.strictEqual(render_as_sexpr(values[0], $), "(* a (power b -1))");
        assert.strictEqual(render_as_latex(values[0], $), "\\frac{a}{b}");
    });
});
