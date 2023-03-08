import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv, LambdaExpr } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { divide } from '../../helpers/divide';
import { ASSUME_REAL_VARIABLES, IMAG, REAL } from '../../runtime/constants';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { MATH_ADD, MATH_MUL, MATH_POW } from '../../runtime/ns_math';
import { one, zero } from '../../tree/rat/Rat';
import { cons, Cons, is_cons, items_to_cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { is_sym } from '../sym/is_sym';

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
    // console.lg("real", $.toSExprString(expr));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, where: string): U {
        // console.lg(`HOOK: real of ${$.toInfixString(expr)} => ${$.toInfixString(retval)} (${where})`);
        return retval;
    };

    if ($.isReal(expr)) {
        return expr;
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
            return hook(expr, 'D');
        }
    }
    else if (is_multiply(expr)) {
        // console.lg("Computing Re of a * expression...", $.toSExprString(expr));
        const rs: U[] = []; // treat as real.
        const cs: U[] = []; // treat as complex.
        [...expr.argList].forEach(function (arg) {
            // console.lg("testing the arg:", $.toInfixString(arg));
            if ($.isReal(arg)) {
                // console.lg("arg is real:", $.toInfixString(arg));
                rs.push(arg);
            }
            else {
                // console.lg("arg is NOT real:", $.toInfixString(arg));
                // With no boolean response, we have to assume that the argument is not real valued.
                // How do we make progress with the factors that are complex numbers?
                if (is_sym(arg)) {
                    // console.lg("arg is Sym and possibly complex", $.toInfixString(arg));
                    const x = items_to_cons(REAL, arg);
                    const y = items_to_cons(IMAG, arg);
                    const iy = items_to_cons(MATH_MUL, imu, y);
                    const z = items_to_cons(MATH_ADD, x, iy);
                    // console.lg("Z=>", $.toInfixString(z));
                    cs.push(z);
                }
                else if (arg.equals(imu)) {
                    // console.lg("arg is imu", $.toInfixString(arg));
                    cs.push(arg);
                }
                else if (is_power(arg)) {
                    const base = arg.lhs;
                    const expo = arg.rhs;
                    // console.lg("base", $.toInfixString(base));
                    // console.lg("expo", $.toInfixString(expo));
                    if ($.isReal(base)) {
                        // console.lg("base is real", $.toInfixString(base));
                        rs.push(arg);
                    }
                    else {
                        if (is_rat(expo) && expo.isInteger() && expo.isNegative()) {
                            const conj_base = complex_conjugate(base, $);
                            const A = $.valueOf(items_to_cons(MATH_POW, base, expo.succ()));
                            const B = $.valueOf(conj_base);
                            const numer = $.valueOf(items_to_cons(MATH_MUL, A, B));
                            const denom = $.valueOf(items_to_cons(MATH_MUL, base, conj_base));
                            const C = divide(numer, denom, $);
                            // console.lg("base is possibly complex", $.toInfixString(base));
                            cs.push(C);
                        }
                        else {
                            throw new Error("Power" + $.toInfixString(expr));
                        }
                    }
                }
                else if (is_cons(arg) && is_sym(arg.opr)) {
                    // console.lg(`getChain ${$.toInfixString(REAL)} ${$.toInfixString(arg.opr)}`);
                    const chain = $.getChain(REAL, arg.opr);
                    if (chain) {
                        return chain(expr.argList, $);
                    }
                    else {
                        throw new Error(`${$.toInfixString(REAL)} ${$.toInfixString(arg.opr)}`);
                    }
                }
                else {
                    // Here we might encounter a function.
                    // So far we've handled math.pow.
                    // How to handle arbitrary functions. e.g. abs, sin, ...
                    throw new Error($.toSExprString(arg));
                }
            }
        });
        const A = multiply_factors(rs, $);
        // console.lg("A", $.toInfixString(A));
        const B = multiply_factors(cs, $);
        // console.lg("B", $.toInfixString(B));
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
