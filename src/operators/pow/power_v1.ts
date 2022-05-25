import { nativeDouble, rational } from "../../bignum";
import { gt_num_num } from "../../calculators/compare/gt_num_num";
import { complex_conjugate } from "../../complex_conjugate";
import { dpow } from "../../dpow";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { imu } from "../../env/imu";
import { iscomplexnumberdouble, iseveninteger, isminusoneovertwo, is_complex_number, is_num_and_eq_minus_one, is_num_and_gt_zero, is_one_over_two, is_plus_or_minus_one } from "../../is";
import { is_rat_integer } from "../../is_rat_integer";
import { makeList } from "../../makeList";
import { nativeInt } from "../../nativeInt";
import { power_sum, simplify_polar } from "../../power";
import { pow_rat_rat } from "../../pow_rat_rat";
import { is_base_of_natural_logarithm } from "../../predicates/is_base_of_natural_logarithm";
import { is_num } from "../../predicates/is_num";
import { rect } from "../../rect";
import { ARCTAN, ASSUME_REAL_VARIABLES, avoidCalculatingPowersIntoArctans, COS, LOG, MULTIPLY, PI, POWER, SIN } from "../../runtime/constants";
import { defs, DynamicConstants } from "../../runtime/defs";
import { is_abs, is_add, is_multiply, is_power } from "../../runtime/helpers";
import { sine } from "../../sin";
import { power_tensor } from "../../tensor";
import { flt } from "../../tree/flt/Flt";
import { is_flt } from "../../tree/flt/is_flt";
import { caddr, cadr } from "../../tree/helpers";
import { is_rat } from "../../tree/rat/is_rat";
import { half, negOne, one, two, zero } from "../../tree/rat/Rat";
import { is_tensor } from "../../tree/tensor/is_tensor";
import { car, Cons, is_cons, is_nil, U } from "../../tree/tree";
import { QQ } from "../../tree/uom/QQ";
import { abs } from "../abs/abs";
import { is_uom } from "../uom/UomExtension";

/**
 * 
 * @param base
 * @param expo 
 * @param origExpr The original power expression, which is returned if no simplifications are made. 
 * @param $ 
 * @returns 
 */
export function power_v1(base: U, expo: U, origExpr: Cons, $: ExtensionEnv): U {
    // console.log(`power_v1 base=${print_list(base, $)} expo=${print_list(expo, $)}`);
    if (typeof base === 'undefined') {
        throw new Error("base must be defined.");
    }
    if (typeof expo === 'undefined') {
        throw new Error("expo must be defined.");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        // console.lg(`power ${base} ${exponent} => ${retval} made by power_v1 at ${description}`);
        return retval;
    };

    // first, some very basic simplifications right away

    //  1 ^ a    ->  1
    //  a ^ 0    ->  1
    if ($.equals(base, one) || $.isZero(expo)) {
        const one = DynamicConstants.One();
        return hook(one, "A");
    }

    //  a ^ 1    ->  a
    if ($.equals(expo, one)) {
        return hook(base, "B");
    }

    //   -1 ^ -1    ->  -1
    if (is_num_and_eq_minus_one(base) && is_num_and_eq_minus_one(expo)) {
        const negOne = $.negate(DynamicConstants.One());
        return hook(negOne, "C");
    }

    //   -1 ^ 1/2  ->  i
    if (is_num_and_eq_minus_one(base) && is_one_over_two(expo)) {
        return hook(imu, "D");
    }

    //   -1 ^ -1/2  ->  -i
    if (is_num_and_eq_minus_one(base) && isminusoneovertwo(expo)) {
        const result = $.negate(imu);
        return hook(result, "E");
    }

    let tmp: U;
    //   -1 ^ rational
    if (
        is_num_and_eq_minus_one(base) &&
        !is_flt(base) &&
        is_rat(expo) &&
        !is_rat_integer(expo) &&
        is_num_and_gt_zero(expo) &&
        !defs.evaluatingAsFloats
    ) {
        if (expo.a < expo.b) {
            tmp = makeList(POWER, base, expo);
        }
        else {
            tmp = makeList(
                MULTIPLY,
                base,
                makeList(
                    POWER,
                    base,
                    rational(expo.a.mod(expo.b), expo.b)
                )
            );
        }

        // evaluates clock form into
        // rectangular form. This seems to give
        // slightly better form to some test results.
        const result = rect(tmp, $);
        return hook(result, "F");
    }

    // both base and exponent are rational numbers?
    if (is_rat(base) && is_rat(expo)) {
        const result = pow_rat_rat(base, expo, $);
        return hook(result, "G");
    }

    // both base and exponent are either rational or double?
    if (is_num(base) && is_num(expo)) {
        const result = dpow(nativeDouble(base), nativeDouble(expo), $);
        return hook(result, "H");
    }

    if (is_tensor(base)) {
        const result = power_tensor(base, expo, $);
        return hook(result, "I");
    }

    if (is_uom(base)) {
        if (is_rat(expo)) {
            const qq = QQ.valueOf(expo.a.toJSNumber(), expo.b.toJSNumber());
            return hook(base.pow(qq), "J");
        }
        else if (is_flt(expo)) {
            const qq = QQ.valueOf(expo.d, 1);
            return hook(base.pow(qq), "K");
        }
    }

    // if we only assume variables to be real, then |a|^2 = a^2
    // (if x is complex this doesn't hold e.g. i, which makes 1 and -1
    // Looking for (pow (abs ...) )
    if (is_cons(base) && is_abs(base) && iseveninteger(expo) && !$.isZero($.getBinding(ASSUME_REAL_VARIABLES))) {
        const result = $.power(cadr(base), expo);
        return hook(result, "L");
    }

    // TODO: This code will be extracted into special handlers (all code should be?).

    // e^log(...)
    if (is_base_of_natural_logarithm(base) && car(expo) === LOG) {
        const result = cadr(expo);
        return hook(result, "M");
    }

    // e^some_float
    // Expect this to be covered by math.exp.Flt operator.
    if (is_base_of_natural_logarithm(base) && is_flt(expo)) {
        const result = flt(Math.exp(expo.d));
        return hook(result, "N");
    }

    // complex number in exponential form, get it to rectangular
    // but only if we are not in the process of calculating a polar form,
    // otherwise we'd just undo the work we want to do
    if (is_base_of_natural_logarithm(base) && expo.contains(imu) && expo.contains(PI) && !defs.evaluatingPolar) {
        // TODO: We could simply use origExpr now that it is an agument.
        const tmp = makeList(POWER, base, expo);

        const hopefullySimplified = rect(tmp, $); // put new (hopefully simplified expr) in exponent
        if (!hopefullySimplified.contains(PI)) {
            return hook(hopefullySimplified, "O");
        }
    }

    //  (* a1 a2 a3 ...) ^ m  ->  (a1 ^ m) * (a2 ^ m) * (a3 ^ m) ...
    // note that we can't in general do this, for example
    // sqrt(x*y) != x^(1/2) y^(1/2) (counterexample" x = -1 and y = -1)
    // BUT we can carve-out here some cases where this
    // transformation is correct
    if ($.isExpanding()) {
        if (is_multiply(base) && is_rat_integer(expo)) {
            const aList = base.cdr;
            if (is_cons(aList)) {
                const a1 = aList.car;
                let result = $.power(a1, expo);
                if (is_cons(aList)) {
                    const others = aList.tail();
                    result = others.reduce((prev: U, curr: U) => $.multiply(prev, $.power(curr, expo)), result);
                }
                return hook(result, "P");
            }
            if (is_nil(aList)) {
                // Slightly strange case of no a's means (*) => 1, and then 1 ^ m is simply 1.
                return hook(one, "Q");
            }
        }
    }

    // (a ^ b) ^ c  ->  a ^ (b * c)
    // note that we can't in general do this, for example
    // sqrt(x^y) !=  x^(1/2 y) (counterexample x = -1)
    // BUT we can carve-out here some cases where this
    // transformation is correct
    // simple numeric check to see if a is a number > 0
    let is_a_moreThanZero = false;
    const cadrBase = cadr(base);
    if (is_num(cadrBase)) {
        is_a_moreThanZero = gt_num_num(cadrBase, zero);
    }

    // when c is an integer and when a is >= 0
    if (is_power(base) && (is_rat_integer(expo) || is_a_moreThanZero)) {
        const result = $.power(cadr(base), $.multiply(caddr(base), expo));
        return hook(result, "R");
    }

    let b_isEven_and_c_isItsInverse = false;
    if (iseveninteger(caddr(base))) {
        const isThisOne = $.multiply(caddr(base), expo);
        if (is_plus_or_minus_one(isThisOne, $)) {
            b_isEven_and_c_isItsInverse = true;
        }
    }

    if (is_power(base) && b_isEven_and_c_isItsInverse) {
        if ($.isFactoring()) {
            const result = abs(cadr(base), $);
            return hook(result, "S");
        }
        else {
            return hook(origExpr, "S");
        }
    }

    //  when expanding,
    //  (a + b) ^ n  ->  (a + b) * (a + b) ...
    if ($.isExpanding() && is_add(base) && is_num(expo)) {
        const n = nativeInt(expo);
        if (n > 1 && !isNaN(n)) {
            const result = power_sum(n, base, $);
            return hook(result, "T");
        }
    }

    //  sin(x) ^ 2n -> (1 - cos(x) ^ 2) ^ n
    if (defs.trigmode === 1 && car(base).equals(SIN) && iseveninteger(expo)) {
        const result = $.power(
            $.subtract(one, $.power($.cos(cadr(base)), two)),
            $.multiply(expo, half)
        );
        return hook(result, "U");
    }

    //  cos(x) ^ 2n -> (1 - sin(x) ^ 2) ^ n
    if (defs.trigmode === 2 && car(base).equals(COS) && iseveninteger(expo)) {
        const result = $.power(
            $.subtract(one, $.power(sine(cadr(base), $), two)),
            $.multiply(expo, half)
        );
        return hook(result, "V");
    }

    // console.lg(`${$.toInfixString(base)} TESTING FOR IS COMPLEX...`);
    // complex number? (just number, not expression)
    if (is_complex_number(base)) {
        // console.lg(`${$.toInfixString(base)} IS COMPLEX`)
        // integer power?
        // n will be negative here, positive n already handled
        if (is_rat_integer(expo)) {
            //               /        \  n
            //         -n   |  a - ib  |
            // (a + ib)   = | -------- |
            //              |   2   2  |
            //               \ a + b  /
            const p3 = complex_conjugate(base, $);

            // gets the denominator
            let result = $.divide(p3, $.multiply(p3, base));

            if (!is_plus_or_minus_one(expo, $)) {
                result = $.power(result, $.negate(expo));
            }
            return hook(result, "W");
        }

        // noninteger or floating power?
        if (is_num(expo)) {
            // remember that the "double" type is
            // toxic, i.e. it propagates, so we do
            // need to evaluate PI to its actual double
            // value

            const pi =
                defs.evaluatingAsFloats ||
                    (iscomplexnumberdouble(base, $) && is_flt(expo))
                    ? flt(Math.PI)
                    : PI;
            let tmp = $.multiply(
                $.power(abs(base, $), expo),
                $.power(negOne, $.divide($.multiply($.arg(base), expo), pi))
            );

            // if we calculate the power making use of arctan:
            //  * it prevents nested radicals from being simplified
            //  * results become really hard to manipulate afterwards
            //  * we can't go back to other forms.
            // so leave the power as it is.
            if (avoidCalculatingPowersIntoArctans && tmp.contains(ARCTAN)) {
                tmp = makeList(POWER, base, expo);
            }

            return hook(tmp, "X");
        }
    }

    const polarResult = simplify_polar(expo, $);
    if (polarResult !== undefined) {
        return hook(polarResult, "Y");
    }

    return hook(origExpr, "Z");
}
