import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv, LambdaExpr } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { divide } from '../../helpers/divide';
import { Native } from '../../native/Native';
import { native_sym } from '../../native/native_sym';
import { ASSUME_REAL_VARIABLES } from '../../runtime/constants';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { negOne, one, zero } from '../../tree/rat/Rat';
import { cons, Cons, is_cons, items_to_cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { is_sym } from '../sym/is_sym';
import { compute_r_from_base_and_expo } from './compute_r_from_base_and_expo';
import { compute_theta_from_base_and_expo } from './compute_theta_from_base_and_expo';

const MATH_ADD = native_sym(Native.add);
const CONJ = native_sym(Native.conj);
const COS = native_sym(Native.cosine);
const EXP = native_sym(Native.exp);
const IMAG = native_sym(Native.imag);
const MATH_MUL = native_sym(Native.multiply);
const MATH_POW = native_sym(Native.pow);
const REAL = native_sym(Native.real);

/**
 * expr = (real arg)
 * @param expr 
 * @param $ 
 * @returns 
 */
export function Eval_real(expr: Cons, $: ExtensionEnv): U {
    // Do we evaluate the arguments or real_lambda?
    return real_lambda(expr.argList, $);
}

/**
 * argList = (arg)
 * @param argList 
 * @param $ 
 * @returns 
 */
export const real_lambda: LambdaExpr = function (argList: Cons, $: ExtensionEnv) {
    // We could/should check the numbr of arguments.
    const arg = $.valueOf(argList.car);
    return real(arg, $);
};

/**
 * Returns the real part of complex z
 * We assume the expr has already been evaluated.
 * @param expr 
 * @param $ 
 * @returns 
 */
export function real(expr: U, $: ExtensionEnv): U {
    // console.lg(`real`, $.toInfixString(expr));
    // console.lg("real", $.toSExprString(expr));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`HOOK: real part of ${$.toInfixString(expr)} is ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    if ($.is_real(expr)) {
        return hook(expr, 'A');
    }
    else if (is_rat(expr)) {
        return expr;
    }
    else if (is_sym(expr)) {
        const flag = $.getSymbolValue(ASSUME_REAL_VARIABLES);
        if (is_rat(flag) && flag.isOne()) {
            return expr;
        }
        else {
            return items_to_cons(REAL, expr);
        }
    }
    else if (is_add(expr)) {
        // console.lg("is_add", $.toInfixString(expr));
        const argList = expr.argList;
        const A = argList.map(function (arg) {
            return real(arg, $);
        });
        const sum = $.valueOf(cons(MATH_ADD, A));
        // console.lg("real of", $.toInfixString(expr), "is", $.toInfixString(sum));
        return hook(sum, 'B');
    }
    else if (is_power(expr)) {
        const base = expr.lhs;
        const expo = expr.rhs;
        // console.lg("base", $.toInfixString(base));
        // console.lg("expo", $.toInfixString(expo));
        if (base.contains(imu)) {
            if (is_rat(expo) && expo.isInteger() && expo.isNegative()) {
                const conj_base = complex_conjugate(base, $);
                const A = $.valueOf(items_to_cons(MATH_POW, base, expo.succ()));
                const B = $.valueOf(conj_base);
                const numer = $.valueOf(items_to_cons(MATH_MUL, A, B));
                const denom = $.valueOf(items_to_cons(MATH_MUL, base, conj_base));
                const C = divide(numer, denom, $);
                return hook($.valueOf(items_to_cons(REAL, C)), 'C');
            }
            else {
                throw new Error("Power");
            }
        }
        else {
            // The expression is in the form of a power.
            // It is natural to then take a log: log(z) = log(base^expo)=>expo*log(base)
            // Now let z = r * exp(i*theta). log(z) = log(r) + i * theta
            // Hence log(r) + i * theta = expo*log(base)
            // real(z) = r * cos(theta)
            // log(r) = real(expo*log(base))
            // r = exp(real(expo*log(base)))
            // theta = imag(expo*log(base)) 
            // console.lg("base", $.toInfixString(base));
            // console.lg("expo", $.toInfixString(expo));
            // console.lg("YIN");
            const r = compute_r_from_base_and_expo(base, expo, $);
            const theta = compute_theta_from_base_and_expo(base, expo, $);
            const cos_theta = $.valueOf(items_to_cons(COS, theta));
            const retval = $.valueOf(items_to_cons(MATH_MUL, r, cos_theta));
            return hook(retval, 'D');
        }
    }
    else if (is_multiply(expr)) {
        // console.lg("Computing Re of a * expression...", $.toSExprString(expr));
        const rs: U[] = []; // the real factors.
        const cs: U[] = []; // the complex factors
        [...expr.argList].forEach(function (factor) {
            // console.lg("testing the arg:", $.toInfixString(arg));
            if ($.is_real(factor)) {
                // console.lg("arg is real:", $.toInfixString(arg));
                rs.push(factor);
            }
            else {
                // console.lg("arg is NOT real:", $.toInfixString(arg));
                // console.lg("arg is NOT real:", $.toInfixString(arg));
                // With no boolean response, we have to assume that the argument is not real valued.
                // How do we make progress with the factors that are complex numbers?
                if (is_sym(factor)) {
                    // console.lg("arg is Sym and possibly complex", $.toInfixString(arg));
                    const x = items_to_cons(REAL, factor);
                    const y = items_to_cons(IMAG, factor);
                    const iy = items_to_cons(MATH_MUL, imu, y);
                    const z = items_to_cons(MATH_ADD, x, iy);
                    // console.lg("Z=>", $.toInfixString(z));
                    cs.push(z);
                }
                else if (factor.equals(imu)) {
                    // console.lg("arg is imu", $.toInfixString(arg));
                    cs.push(factor);
                }
                else if (is_power(factor)) {
                    const base = factor.lhs;
                    const expo = factor.rhs;
                    if (is_rat(expo) && expo.isMinusOne()) {
                        // Get the complex number out of the denominator.
                        const z_star = $.valueOf(items_to_cons(CONJ, base));
                        const denom = $.valueOf(items_to_cons(MATH_MUL, z_star, base));
                        const one_over_denom = $.valueOf(items_to_cons(MATH_POW, denom, negOne));
                        const z = $.valueOf(items_to_cons(MATH_MUL, z_star, one_over_denom));
                        cs.push(z);
                    }
                    else {
                        // console.lg("base", $.toInfixString(base));
                        // console.lg("expo", $.toInfixString(expo));
                        // console.lg("YAN");
                        const r = compute_r_from_base_and_expo(base, expo, $);
                        // console.lg("r", $.toInfixString(r));
                        const theta = compute_theta_from_base_and_expo(base, expo, $);
                        // console.lg("theta", $.toInfixString(theta));
                        const i_times_theta = $.valueOf(items_to_cons(MATH_MUL, imu, theta));
                        const cis_theta = $.valueOf(items_to_cons(EXP, i_times_theta));
                        // console.lg("cis_theta", $.toInfixString(cis_theta));
                        rs.push(r);
                        cs.push(cis_theta);
                    }
                }
                else if (is_cons(factor) && is_sym(factor.opr)) {
                    cs.push(factor);
                }
                else {
                    // console.lg("WT...");
                    // Here we might encounter a function.
                    // So far we've handled math.pow.
                    // How to handle arbitrary functions. e.g. abs, sin, ...
                    throw new Error($.toSExprString(factor));
                }
            }
        });
        const A = multiply_factors(rs, $);
        // console.lg("A", $.toInfixString(A));
        const B = multiply_factors(cs, $);
        // console.lg("B", $.toInfixString(B));
        // console.lg("exp", $.toInfixString(expr));
        const C = $.valueOf(items_to_cons(REAL, B));
        // console.lg("C", $.toSExprString(C));
        const D = $.valueOf(items_to_cons(MATH_MUL, A, C));
        // console.lg("D", $.toSExprString(D));
        // console.lg("real of", $.toInfixString(expr), "is", $.toInfixString(D));
        return D;
    }
    else if (expr.equals(imu)) {
        return zero;
    }
    else if (is_cons(expr)) {
        const opr = expr.opr;
        if (is_sym(opr)) {
            return $.getChain(REAL, opr)(expr.argList, $);
        }
        else {
            throw new Error(`const but opr is not Sym ${JSON.stringify(expr)} ${$.toSExprString(expr)}`);
        }
    }
    else {
        throw new Error(`Finally ${JSON.stringify(expr)} ${$.toSExprString(expr)}`);
    }
    /*
    // I'm not sure why this first step is necessary; it should not be.
    // const rect_z = rect(z, $);
    const conj_z = complex_conjugate(expr, $);
    // console.lg(`rect_z => ${$.toInfixString(rect_z)}`);
    // console.lg(`conj_z => ${$.toInfixString(conj_z)}`);
    const two_re = $.add(expr, conj_z);
    // console.lg(`2*x => ${$.toInfixString(two_re)}`);
    const re = divide(two_re, two, $);
    return hook(re, "");
    */
    return hook(expr, 'E');
}

function multiply_factors(factors: U[], $: ExtensionEnv): U {
    if (factors.length > 1) {
        return $.valueOf(items_to_cons(MATH_MUL, ...factors));
    }
    else if (factors.length === 1) {
        return $.valueOf(factors[0]);
    }
    else {
        return one;
    }
}
