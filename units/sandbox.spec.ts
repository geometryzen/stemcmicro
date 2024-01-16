
import { assert } from "chai";
import { create_engine, ExprEngine } from "../src/api/index";

describe("sandbox", function () {
    it("multiline", function () {
        const lines: string[] = [
            `aaa`,
            `[b]`,
            `"c"`,
            `123`,
            `1.5`
        ];
        const sourceText = lines.join('\n');
        const engine: ExprEngine = create_engine({ useGeometricAlgebra: true });
        const { module, errors } = engine.parseModule(sourceText, {});
        assert.strictEqual(errors.length, 0);
        assert.strictEqual(engine.renderAsString(module), `module(aaa,[b],"c",123,1.5)`);
        assert.strictEqual(engine.renderAsString(module, { format: 'SExpr' }), `(module aaa [b] "c" 123 1.5)`);

        const a = module.item(1);
        assert.strictEqual(engine.renderAsString(a), "aaa");
        assert.strictEqual(a.pos, 0);
        assert.strictEqual(a.end, 3);

        const b = module.item(2);
        assert.strictEqual(engine.renderAsString(b), "[b]");
        assert.strictEqual(b.pos, 4);
        assert.strictEqual(b.end, 7);

        const str = module.item(3);
        assert.strictEqual(engine.renderAsString(str), `"c"`);
        assert.strictEqual(str.pos, 8);
        assert.strictEqual(str.end, 11);

        const rat = module.item(4);
        assert.strictEqual(engine.renderAsString(rat), "123");
        assert.strictEqual(rat.pos, 12);
        assert.strictEqual(rat.end, 15);

        const flt = module.item(5);
        assert.strictEqual(engine.renderAsString(flt), "1.5");
        assert.strictEqual(flt.pos, 16);
        assert.strictEqual(flt.end, 19);

        engine.release();
    });
});