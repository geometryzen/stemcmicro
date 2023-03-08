import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("abs", function () {
    it("abs(0.0)", function () {
        const lines: string[] = [
            `abs(0.0)`
        ];
        const context = create_script_context({
            assumes: {
                'a': {}
            }
        });

        const aValue = context.getSymbolValue('a');
        assert.strictEqual(aValue.toString(), "()");

        const aProps = context.getSymbolProps('a');
        assert.strictEqual(aProps.real, true, "aProps.real");

        const actual = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(actual), '0.0');
        context.release();
    });
    it("abs(1.0)", function () {
        const lines: string[] = [
            `abs(1.0)`
        ];
        const context = create_script_context({
            assumes: {
                'a': {}
            }
        });

        const aValue = context.getSymbolValue('a');
        assert.strictEqual(aValue.toString(), "()");

        const aProps = context.getSymbolProps('a');
        assert.strictEqual(aProps.real, true);

        const actual = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(actual), '1.0');
        context.release();
    });
    it("abs(2.0)", function () {
        const lines: string[] = [
            `abs(2.0)`
        ];
        const context = create_script_context({
            assumes: {
                'a': {}
            }
        });

        const aValue = context.getSymbolValue('a');
        assert.strictEqual(aValue.toString(), "()");

        const aProps = context.getSymbolProps('a');
        assert.strictEqual(aProps.real, true);

        const actual = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(actual), '2.0');
        context.release();
    });
});

xdescribe("sandbox", function () {
    xit("(a) should be converted to a power expression", function () {
        const lines: string[] = [
            `assumeRealVariables=0`,
            `abs(a)**2`
        ];
        const context = create_script_context({
            assumes: {
                'a': {}
            }
        });

        const aValue = context.getSymbolValue('a');
        assert.strictEqual(aValue.toString(), "()");

        const aProps = context.getSymbolProps('a');
        assert.strictEqual(aProps.real, true);

        const actual = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(actual), 'a**2');
        context.release();
    });
    xit("(a) should be converted to a power expression", function () {
        const lines: string[] = [
            `sqrt(a**2)`
        ];
        const context = create_script_context({
            assumes: {
                'a': {}
            }
        });

        const aValue = context.getSymbolValue('a');
        assert.strictEqual(aValue.toString(), "()");

        const aProps = context.getSymbolProps('a');
        assert.strictEqual(aProps.real, true);

        const actual = assert_one_value_execute(lines.join('\n'), context);
        assert.strictEqual(context.renderAsInfix(actual), '(a**2)**(1/2)');
        context.release();
    });
});
