import { assert } from "chai";
import { factorizeL } from "../src/calculators/factorizeL";
import { Directive } from "../src/env/ExtensionEnv";
import { imu } from "../src/env/imu";
import { items_to_cons } from "../src/makeList";
import { is_rat } from "../src/operators/rat/is_rat";
import { MATH_MUL } from "../src/runtime/ns_math";
import { create_script_context } from "../src/runtime/script_engine";
import { negOne, one, Rat, two } from "../src/tree/rat/Rat";
import { create_sym } from "../src/tree/sym/Sym";
import { U } from "../src/tree/tree";
import { assert_one_value_execute } from "./assert_one_value_execute";

const a = create_sym('a');
const b = create_sym('b');
const c = create_sym('c');
const d = create_sym('d');

const x = create_sym('x');
const y = create_sym('y');

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

xdescribe("factorize Rat", function () {
    it("k*x+k*y", function () {
        const lines: string[] = [
            `k*x+k*y`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "k*(x+y)");
        engine.release();
    });
    it("k*x-k*y", function () {
        const lines: string[] = [
            `k*x-k*y`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(value), "k*(x-y)");
        engine.release();
    });
});

describe("factorizeL", function () {
    it("(a) should be [a, 1]", function () {
        const retval = factorizeL(a);
        const expectL = a;
        const expectR = one;
        check(retval, expectL, expectR);
    });
    it("a*b should be [a,b]", function () {
        const retval = factorizeL(items_to_cons(MATH_MUL, a, b));
        const expectL = a;
        const expectR = b;
        check(retval, expectL, expectR);
    });
    it("a*b*c should be [a,b*c]", function () {
        const retval = factorizeL(items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, a, b), c));
        const expectL = a;
        const expectR = items_to_cons(MATH_MUL, b, c);
        check(retval, expectL, expectR);
    });
    it("a*b*c*d should be [a,b*c*d]", function () {
        const retval = factorizeL(items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, a, b), c), d));
        const expectL = a;
        const expectR = items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, b, c), d);
        check(retval, expectL, expectR);
    });
    it("i*x*y", function () {
        const input = items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, imu, x), y);
        const retval = factorizeL(input);
        const expectL = imu;
        const expectR = items_to_cons(MATH_MUL, x, y);
        check(retval, expectL, expectR);
    });
    it("-i*x*y", function () {
        let input = items_to_cons(MATH_MUL, negOne, imu);
        input = items_to_cons(MATH_MUL, input, x);
        input = items_to_cons(MATH_MUL, input, y);
        const retval = factorizeL(input);
        const expectL = negOne;
        const expectR = items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, imu, x), y);
        check(retval, expectL, expectR);
    });
});

describe("is_rat_times", function () {
    it("a", function () {
        assert.isFalse(is_rat_times_any(a));
    });
    it("2*a", function () {
        assert.isTrue(is_rat_times_any(items_to_cons(MATH_MUL, two, a)));
    });
    it("i*x*y", function () {
        const expr = items_to_cons(MATH_MUL, items_to_cons(MATH_MUL, imu, x), y);
        assert.isFalse(is_rat_times_any(expr));
    });
    it("-i*x*y", function () {
        const A = items_to_cons(MATH_MUL, negOne, imu);
        const B = items_to_cons(MATH_MUL, A, x);
        const C = items_to_cons(MATH_MUL, B, y);
        const expr = C;
        assert.isTrue(is_rat_times_any(expr));
    });
});

xdescribe("factorizeR", function () {
    it("2 * X - X", function () {
        const lines: string[] = [
            `2*a*b-a*b`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* a b)');
        assert.strictEqual(engine.renderAsInfix(actual), 'a*b');
        engine.release();
    });
    it("2 * X + X", function () {
        const lines: string[] = [
            `2*a*b+a*b`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* 3 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*a*b');
        engine.release();
    });
    it("X + 2 * X", function () {
        const lines: string[] = [
            `a*b+2*a*b`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* 3 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*a*b');
        engine.release();
    });
    it("-2 * X + X", function () {
        const lines: string[] = [
            `-2*a*b+a*b`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsSExpr(actual), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '-a*b');
        engine.release();
    });
});

xdescribe("", function () {
    it("(X + 2 * A) + 3 * A", function () {
        const lines: string[] = [
            `(X + 2 * A) + 3 * A`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '5*A+X');
        engine.release();
    });
    it("(X + 2 * A) + A", function () {
        const lines: string[] = [
            `(X + 2 * A) + A`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*A+X');
        engine.release();
    });
    it("(X + A) + 2 * A", function () {
        const lines: string[] = [
            `(X + A) + 2*A`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*A+X');
        engine.release();
    });
    it("(X + 2 * A * B) + 3 * A * B", function () {
        const lines: string[] = [
            `(X + 2 * A * B) + 3 * A * B`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '5*A*B+X');
        engine.release();
    });
    it("(X + 2 * A * B) + A * B", function () {
        const lines: string[] = [
            `(X + 2 * A * B) + A * B`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*A*B+X');
        engine.release();
    });
    it("(X + A * B) + 2 * A * B", function () {
        const lines: string[] = [
            `(X + A * B) + 2 * A * B`,
        ];
        const engine = create_script_context({});
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(actual,$), '(* -1 a b)');
        assert.strictEqual(engine.renderAsInfix(actual), '3*A*B+X');
        engine.release();
    });
});

xdescribe("factorize right", function () {
    it("factoring", function () {
        const lines: string[] = [
            `a*b+b`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(engine.renderAsInfix(value), "(1+a)*b");
        engine.release();
    });
    it("factoring", function () {
        const lines: string[] = [
            `a*b*c+c`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(engine.renderAsInfix(value), "(a*b+1)*c");
        engine.release();
    });
    xit("factoring", function () {
        const lines: string[] = [
            `a*b*c*d*e+c*d*e`,
        ];
        const engine = create_script_context({ useDefinitions: false });
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value, $), "");
        assert.strictEqual(engine.renderAsInfix(value), "(a*b+1)*c*d*e");
        engine.release();
    });
});

describe("factorize", function () {
    describe("power", function () {
        it("Disabled", function () {
            const lines: string[] = [
                `x*x`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom'],
                disable: [Directive.factor]
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "x**2");
            engine.release();
        });
        it("Enabled", function () {
            const lines: string[] = [
                `x*x`
            ];
            const engine = create_script_context({
                dependencies: ['Blade', 'Vector', 'Flt', 'Imu', 'Uom']
            });
            const value = assert_one_value_execute(lines.join('\n'), engine);
            assert.strictEqual(engine.renderAsInfix(value), "x**2");
            engine.release();
        });
    });
});
