import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";
/*
  'circexp(sinh(x))',
  '1/2*exp(x)-1/2*exp(-x)',

  'circexp(tanh(x))',
  '-1/(1+exp(2*x))+exp(2*x)/(1+exp(2*x))',

  'circexp([cos(x),sin(x)])',
  '[1/2*exp(-i*x)+1/2*exp(i*x),1/2*i*exp(-i*x)-1/2*i*exp(i*x)]',

  'circexp(cos(x)*sin(x))-expcos(x)*expsin(x)',
  '0',

  'circexp(i*2^(1/4)*sin(1/8*pi)+2^(1/4)*cos(1/8*pi))',
  '2^(1/4)*exp(1/8*i*pi)',
*/

xdescribe("circexp", function () {
    it("cos(x)", function () {
        const lines: string[] = [
            `circexp(cos(x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*(exp(x*i)+exp(-x*i))");
        engine.release();
    });
    it("sin(x)", function () {
        const lines: string[] = [
            `circexp(sin(x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: The factor of (1/2) is not factored out, presumably because of the -1 factor.
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*(-exp(x*i)+exp(-x*i))*i");
        engine.release();
    });
    it("tan(x)", function () {
        const lines: string[] = [
            `circexp(tan(x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "(exp(-x*i)-exp(x*i))*i/(exp(x*i)+exp(-x*i))");
        engine.release();
    });
    it("cosh(x)", function () {
        const lines: string[] = [
            `circexp(cosh(x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*(exp(x)+exp(-x))");
        engine.release();
    });
    it("sinh(x)", function () {
        const lines: string[] = [
            `circexp(sinh(x))`
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useCaretForExponentiation: false,
            useDefinitions: false
        });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // TODO: Can this be presented better?
        assert.strictEqual(engine.renderAsInfix(actual), "1/2*(exp(x)-exp(-x))");
        engine.release();
    });
});
