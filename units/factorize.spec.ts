import { assert } from "chai";
import { render_as_infix, render_as_sexpr } from "../index";
import { factorizeL } from "../src/calculators/factorizeL";
import { imu } from "../src/env/imu";
import { makeList } from "../src/makeList";
import { is_rat } from "../src/operators/rat/is_rat";
import { MATH_MUL } from "../src/runtime/ns_math";
import { create_engine } from "../src/runtime/symengine";
import { negOne, one, Rat, two } from "../src/tree/rat/Rat";
import { Sym } from "../src/tree/sym/Sym";
import { U } from "../src/tree/tree";
import { assert_one_value_execute } from "./assert_one_value_execute";

const a = new Sym('a');
const b = new Sym('b');
const c = new Sym('c');
const d = new Sym('d');

const x = new Sym('x');
const y = new Sym('y');

function check(actual: [U, U, boolean], expectL: U, expectR: U): void {
    if (!actual[0].equals(expectL)) {
        assert.fail(`actualL = ${actual[0]}, expectL = ${expectL}`);
    }
    if (!actual[1].equals(expectR)) {
        assert.fail(`actualR = ${actual[1]}, expectR = ${expectR}`);
    }
}

export function is_rhs_a_rat_multiple_of_lhs(lhs: U, rhs: U): boolean {
    const [factorL, factorR] = factorizeL(rhs);
    return is_rat(factorL) && factorR.equals(lhs);
}

export function match_lhs_a_rat_multiple_of_rhs(lhs: U, rhs: U): { num: Rat } | undefined {
    const [factorL, factorR] = factorizeL(lhs);
    if (is_rat(factorL) && factorR.equals(rhs)) {
        return { num: factorL };
    }
    else {
        return void 0;
    }
}

function is_rat_times_any(expr: U): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [lhs, rhs] = factorizeL(expr);
    return is_rat(lhs);
}

describe("factorizeL", function () {
    it("(a) should be [a, 1]", function () {
        const retval = factorizeL(a);
        const expectL = a;
        const expectR = one;
        check(retval, expectL, expectR);
    });
    it("a*b should be [a,b]", function () {
        const retval = factorizeL(makeList(MATH_MUL, a, b));
        const expectL = a;
        const expectR = b;
        check(retval, expectL, expectR);
    });
    it("a*b*c should be [a,b*c]", function () {
        const retval = factorizeL(makeList(MATH_MUL, makeList(MATH_MUL, a, b), c));
        const expectL = a;
        const expectR = makeList(MATH_MUL, b, c);
        check(retval, expectL, expectR);
    });
    it("a*b*c*d should be [a,b*c*d]", function () {
        const retval = factorizeL(makeList(MATH_MUL, makeList(MATH_MUL, makeList(MATH_MUL, a, b), c), d));
        const expectL = a;
        const expectR = makeList(MATH_MUL, makeList(MATH_MUL, b, c), d);
        check(retval, expectL, expectR);
    });
    it("i*x*y", function () {
        const input = makeList(MATH_MUL, makeList(MATH_MUL, imu, x), y);
        const retval = factorizeL(input);
        const expectL = imu;
        const expectR = makeList(MATH_MUL, x, y);
        check(retval, expectL, expectR);
    });
    it("-i*x*y", function () {
        let input = makeList(MATH_MUL, negOne, imu);
        input = makeList(MATH_MUL, input, x);
        input = makeList(MATH_MUL, input, y);
        const retval = factorizeL(input);
        const expectL = negOne;
        const expectR = makeList(MATH_MUL, makeList(MATH_MUL, imu, x), y);
        check(retval, expectL, expectR);
    });
});

describe("is_rat_times", function () {
    it("a", function () {
        assert.isFalse(is_rat_times_any(a));
    });
    it("2*a", function () {
        assert.isTrue(is_rat_times_any(makeList(MATH_MUL, two, a)));
    });
    it("i*x*y", function () {
        const expr = makeList(MATH_MUL, makeList(MATH_MUL, imu, x), y);
        assert.isFalse(is_rat_times_any(expr));
    });
    it("-i*x*y", function () {
        const A = makeList(MATH_MUL, negOne, imu);
        const B = makeList(MATH_MUL, A, x);
        const C = makeList(MATH_MUL, B, y);
        const expr = C;
        assert.isTrue(is_rat_times_any(expr));
    });
});

describe("factorizeR", function () {
    it("2 * X - X", function () {
        const lines: string[] = [
            `implicate=0`,
            `2*a*b-a*b`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(* a b)');
        assert.strictEqual(render_as_infix(actual, $), 'a*b');
        engine.release();
    });
    it("2 * X + X", function () {
        const lines: string[] = [
            `implicate=1`,
            `2*a*b+a*b`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(* 3 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*a*b');
        engine.release();
    });
    it("X + 2 * X", function () {
        const lines: string[] = [
            `implicate=1`,
            `a*b+2*a*b`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(* 3 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*a*b');
        engine.release();
    });
    it("-2 * X + X", function () {
        const lines: string[] = [
            `implicate=1`,
            `-2*a*b+a*b`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(render_as_sexpr(actual, $), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '-a*b');
        engine.release();
    });
});

describe("", function () {
    it("(X + 2 * A) + 3 * A", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + 2 * A) + 3 * A`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '5*A+X');
        engine.release();
    });
    it("(X + 2 * A) + A", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + 2 * A) + A`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*A+X');
        engine.release();
    });
    it("(X + A) + 2 * A", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + A) + 2*A`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*A+X');
        engine.release();
    });
    it("(X + 2 * A * B) + 3 * A * B", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + 2 * A * B) + 3 * A * B`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '5*A*B+X');
        engine.release();
    });
    it("(X + 2 * A * B) + A * B", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + 2 * A * B) + A * B`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*A*B+X');
        engine.release();
    });
    it("(X + A * B) + 2 * A * B", function () {
        const lines: string[] = [
            `implicate=1`,
            `(X + A * B) + 2 * A * B`,
        ];
        const engine = create_engine({});
        const $ = engine.$;
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(render_as_infix(actual, $), '3*A*B+X');
        engine.release();
    });
});

describe("factorize right", function () {
    it("factoring", function () {
        const lines: string[] = [
            `a*b+b`,
        ];
        const engine = create_engine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(render_as_infix(value, $), "(1+a)*b");
        engine.release();
    });
    it("factoring", function () {
        const lines: string[] = [
            `a*b*c+c`,
        ];
        const engine = create_engine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(render_as_infix(value, $), "(1+a*b)*c");
        engine.release();
    });
    it("factoring", function () {
        const lines: string[] = [
            `a*b*c*d*e+c*d*e`,
        ];
        const engine = create_engine({ useDefinitions: false });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(render_as_infix(value, $), "(1+a*b)*c*d*e");
        engine.release();
    });
});
