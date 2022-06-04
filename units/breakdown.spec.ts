import { assert } from "chai";
import { FOCUS_EXPANDING, FOCUS_FACTORING } from "../src/env/ExtensionEnv";
import { render_as_infix } from "../src/print/print";
import { create_engine } from "../src/runtime/symengine";
import { scan_source_text } from "../src/scanner/scan_source_text";

describe("breakdown", function () {
    it("e1 + e1", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b1`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const { values } = engine.executeScript(lines.join('\n'));
        const $ = engine.$;
        engine.$.toInfixString(values[0]);
        assert.strictEqual(render_as_infix(values[0], $), "2*L1");
        engine.release();
    });
    it("", function () {
        const lines: string[] = [
            `G11 = algebra([1, 1], ["L1", "L2"])`,
            `b1 = G11[1]`,
            `b2 = G11[2]`,
            `X = b1 + b2`,
            `X`
        ];
        const engine = create_engine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const scan = scan_source_text(lines.join('\n'));
        assert.strictEqual(scan.trees.length, 5);
        engine.transformTree(scan.trees[0]);
        engine.transformTree(scan.trees[1]);
        engine.transformTree(scan.trees[2]);
        engine.transformTree(scan.trees[3]);
        const data0 = scan.trees[4];
        $.setFocus(FOCUS_EXPANDING);
        const data1 = engine.transformTree(data0);
        $.setFocus(FOCUS_FACTORING);
        const data2 = engine.transformTree(data1.value);
        assert.strictEqual(render_as_infix(data2.value, $), 'L1+L2');
        engine.release();
    });
});
