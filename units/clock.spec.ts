import { assert } from "chai";
import { SyntaxKind } from "../src/parser/parser";
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

xdescribe("clock", function () {
    it("clock((-1)**(1/2))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock((-1)**(1/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const value = assert_one_value_execute(sourceText, context, { syntaxKind: SyntaxKind.Native });
        assert.strictEqual(context.renderAsInfix(value), "(-1)**(1/2)");
        context.release();
    });
    it("clock((-1)**(-1/2))", function () {
        const lines: string[] = [
            `i=sqrt(-1)`,
            `clock((-1)**(-1/2))`
        ];
        const sourceText = lines.join('\n');

        const context = create_script_context({});

        const value = assert_one_value_execute(sourceText, context, { syntaxKind: SyntaxKind.Native });
        assert.strictEqual(context.renderAsInfix(value), "1/(-1)**(1/2)");
        context.release();
    });
    it("i", function () {
        const lines: string[] = [
            `clock(i)`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "(-1)**(1/2)");
        engine.release();
    });
    it("(1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i)", function () {
        const lines: string[] = [
            `clock((1/2+(1/2*3**(1/2))*i)-(1/2+(-1/2*3**(1/2))*i))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(expt (+ (expt x 2) (expt y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(-1)**(1/2)*3**(1/2)");
        engine.release();
    });
    it("clock(exp(i*pi/3))", function () {
        const lines: string[] = [
            `clock(exp(i*pi/3))`,
        ];
        const engine = create_script_context({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "(expt (+ (expt x 2) (expt y 2)) 1/2)");
        assert.strictEqual(engine.renderAsInfix(value), "(-1)**(1/3)");
        engine.release();
    });
});
