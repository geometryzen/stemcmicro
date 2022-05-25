import { assert } from "chai";
import { print_expr, print_list } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("contract-sandbox", function () {
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `A=[[a11,a12],[a21,a22]]`,
            `B=[[b11,b12],[b21,b22]]`,
            `contract(outer(A,B),2,3)`
        ];
        const engine = createSymEngine({ dependencies: [] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "[[a11*b11+a12*b21,a11*b12+a12*b22],[a21*b11+a22*b21,a21*b12+a22*b22]]");
        engine.release();
    });
});

describe("contract", function () {
    it("contract(0)", function () {
        const lines: string[] = [
            `contract(0)`
        ];
        const engine = createSymEngine();
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "0");
        assert.strictEqual(print_expr(actual, $), "0");
        engine.release();
    });
    it("contract(0.0)", function () {
        const lines: string[] = [
            `contract(0.0)`
        ];
        const engine = createSymEngine({ dependencies: ['Flt'] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "0");
        assert.strictEqual(print_expr(actual, $), "0");
        engine.release();
    });
    it("409741429887649/166966608033225 + 1/39", function () {
        const lines: string[] = [
            `409741429887649/166966608033225 + 1/39`
        ];
        const engine = createSymEngine({ dependencies: ['Flt'] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "414022624965424/166966608033225");
        assert.strictEqual(print_expr(actual, $), "414022624965424/166966608033225");
        engine.release();
    });
    it("contract(hilbert(50))", function () {
        const lines: string[] = [
            `contract(hilbert(50))`
        ];
        const engine = createSymEngine({ dependencies: ['Flt'] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "3200355699626285671281379375916142064964/1089380862964257455695840764614254743075");
        assert.strictEqual(print_expr(actual, $), "3200355699626285671281379375916142064964/1089380862964257455695840764614254743075");
        engine.release();
    });
    it("contract([[a,b],[c,d]])", function () {
        const lines: string[] = [
            `contract([[a,b],[c,d]])`
        ];
        const engine = createSymEngine({ dependencies: [] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "(+ a d)");
        assert.strictEqual(print_expr(actual, $), "a+d");
        engine.release();
    });
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `contract([[1,2],[3,4]],1,2)`
        ];
        const engine = createSymEngine({ dependencies: [] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_list(actual, $), "5");
        assert.strictEqual(print_expr(actual, $), "5");
        engine.release();
    });
    it("contract([[1,2],[3,4]],1,2)", function () {
        const lines: string[] = [
            `A=[[a11,a12],[a21,a22]]`,
            `B=[[b11,b12],[b21,b22]]`,
            `contract(outer(A,B),2,3)`
        ];
        const engine = createSymEngine({ dependencies: [] });
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(print_expr(actual, $), "[[a11*b11+a12*b21,a11*b12+a12*b22],[a21*b11+a22*b21,a21*b12+a22*b22]]");
        engine.release();
    });
});
