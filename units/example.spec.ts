import { assert } from "chai";
import {
    create_engine,
    create_env,
    execute_script,
    execute_std_definitions,
    define_std_operators,
    render_as_infix,
    render_as_latex,
    render_as_sexpr
} from "../index";
import { defs } from "../src/runtime/defs";

describe("example", function () {
    it("...", function () {
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
    it("...", function () {
        const lines: string[] = [
            `a/b`
        ];

        const $ = create_env();

        $.resetSymTab();

        // TODO: We would like to get away from these global defs and instead use the environment.
        defs.chainOfUserSymbolsNotFunctionsBeingEvaluated = [];
        defs.evaluatingAsFloat = false;
        defs.evaluatingAsPolar = false;
        defs.omitZeroTermsFromSums = true;
        defs.useCanonicalZero = true;
        defs.addSExprToken = '+';
        defs.mulSExprToken = '*';
        defs.eulerNumberToken = 'e';
        defs.piToken = 'π';
        defs.nilToken = '()';
        defs.renderFloatAsEcmaScript = false;

        $.clearOperators();

        define_std_operators($);

        $.buildOperators();

        execute_std_definitions($);

        const { values } = execute_script(lines.join('\n'), $);

        assert.strictEqual(render_as_infix(values[0], $), "a/b");
        assert.strictEqual(render_as_sexpr(values[0], $), "(* a (power b -1))");
        assert.strictEqual(render_as_latex(values[0], $), "\\frac{a}{b}");

        $.clearOperators();

        $.resetSymTab();
    });
});
