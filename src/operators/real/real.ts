import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { divide } from '../../helpers/divide';
import { REAL } from '../../runtime/constants';
import { is_add, is_multiply, is_power } from '../../runtime/helpers';
import { MATH_ADD, MATH_MUL, MATH_POW } from '../../runtime/ns_math';
import { zero } from '../../tree/rat/Rat';
import { cons, items_to_cons, U } from '../../tree/tree';
import { is_rat } from '../rat/is_rat';
import { is_sym } from '../sym/is_sym';


/**
 * Returns the real part of complex z
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

    if (expr.contains(imu)) {
        if (is_add(expr)) {
            const argList = expr.argList;
            const A = argList.map(function (arg) {
                return real(arg, $);
            });
            return hook($.valueOf(cons(MATH_ADD, A)), 'B');
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
            const rs: U[] = [];
            const cs: U[] = [];
            [...expr.argList].forEach(function (arg) {
                if (arg.contains(imu)) {
                    // How do we make progress with the factors that are complex numbers?
                    if (arg.equals(imu)) {
                        cs.push(arg);
                    }
                    else if (is_power(arg)) {
                        const base = arg.lhs;
                        const expo = arg.rhs;
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
                                cs.push(C);
                            }
                            else {
                                throw new Error("Power");
                            }
                        }
                        else {
                            throw new Error($.toSExprString(arg));
                        }
                    }
                    else {
                        if (is_sym(expr.opr)) {
                            const chain = $.getChain(REAL, expr.opr);
                            if (chain) {
                                return chain(expr.argList, $);
                            }
                            else {
                                throw new Error(`${$.toInfixString(REAL)} ${$.toInfixString(expr.opr)}`);
                            }
                        }
                        // Here we might encounter a function.
                        // So far we've handled math.pow.
                        // How to handle arbitrary functions. e.g. abs, sin, ...
                        throw new Error($.toSExprString(arg));
                    }
                }
                else {
                    rs.push(arg);
                }
            });
            const A = $.valueOf(items_to_cons(MATH_MUL, ...rs));
            const B = $.valueOf(items_to_cons(MATH_MUL, ...cs));
            const C = $.valueOf(items_to_cons(REAL, B));
            const D = $.valueOf(items_to_cons(MATH_MUL, A, C));
            return D;
        }
        else if (expr.equals(imu)) {
            return zero;
        }
        else {
            throw new Error(`Finally ${$.toInfixString(expr)}`);
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
    else {
        // It's already real.
        return hook(expr, 'A');
    }
}
