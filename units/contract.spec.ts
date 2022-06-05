import { assert } from "chai";
import { create_engine } from "../index";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("contract-sandbox", function () {
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `A=[[a11,a12],[a21,a22]]`,
            `B=[[b11,b12],[b21,b22]]`,
            `contract(outer(A,B),2,3)`
        ];
        const engine = create_engine({ dependencies: [] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[a11*b11+a12*b21,a11*b12+a12*b22],[a21*b11+a22*b21,a21*b12+a22*b22]]");
        engine.release();
    });
});

describe("contract", function () {
    it("contract(0)", function () {
        const lines: string[] = [
            `contract(0)`
        ];
        const engine = create_engine();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "0");
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("contract(0.0)", function () {
        const lines: string[] = [
            `contract(0.0)`
        ];
        const engine = create_engine({ dependencies: ['Flt'] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "0");
        assert.strictEqual(engine.renderAsInfix(actual), "0");
        engine.release();
    });
    it("409741429887649/166966608033225 + 1/39", function () {
        const lines: string[] = [
            `409741429887649/166966608033225 + 1/39`
        ];
        const engine = create_engine({ dependencies: ['Flt'] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "414022624965424/166966608033225");
        assert.strictEqual(engine.renderAsInfix(actual), "414022624965424/166966608033225");
        engine.release();
    });
    it("contract(hilbert(50))", function () {
        const lines: string[] = [
            `contract(hilbert(50))`
        ];
        const engine = create_engine({ dependencies: ['Flt'] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "3200355699626285671281379375916142064964/1089380862964257455695840764614254743075");
        assert.strictEqual(engine.renderAsInfix(actual), "3200355699626285671281379375916142064964/1089380862964257455695840764614254743075");
        engine.release();
    });
    it("contract([[a,b],[c,d]])", function () {
        const lines: string[] = [
            `contract([[a,b],[c,d]])`
        ];
        const engine = create_engine({ dependencies: [] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "(+ a d)");
        assert.strictEqual(engine.renderAsInfix(actual), "a+d");
        engine.release();
    });
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `contract([[1,2],[3,4]],1,2)`
        ];
        const engine = create_engine({ dependencies: [] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), "5");
        assert.strictEqual(engine.renderAsInfix(actual), "5");
        engine.release();
    });
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `A=[[a11,a12],[a21,a22]]`,
            `B=[[b11,b12],[b21,b22]]`,
            `contract(outer(A,B),2,3)`
        ];
        const engine = create_engine({ dependencies: [] });
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "[[a11*b11+a12*b21,a11*b12+a12*b22],[a21*b11+a22*b21,a21*b12+a22*b22]]");
        engine.release();
    });
});
