import { ExtensionEnv } from "../env/ExtensionEnv";
import { imu } from '../env/imu';
import { equaln } from '../is';
import { is_rat_and_integer } from '../is_rat_and_integer';
import { is_imu } from '../operators/imu/is_imu';
import { is_tensor } from '../operators/tensor/is_tensor';
import { is_base_of_natural_logarithm } from '../predicates/is_base_of_natural_logarithm';
import { caddr, cadr } from '../tree/helpers';
import { is_cons, U } from '../tree/tree';
import { is_power } from './helpers';

/**
 * find stuff like (-1)^(something), but disregard imaginary units which are in the form (-1)^(1/2))
 * @param expr 
 * @param mysteryArg 
 * @param $ 
 * @returns 
 */
export function has_clock_form(expr: U, mysteryArg: U, $: ExtensionEnv): boolean {

    if (is_imu(expr)) {
        return false;
    }

    const rhs = caddr(mysteryArg);

    if (is_power(expr) && !is_rat_and_integer(rhs)) {
        if (cadr(expr).contains(imu)) {
            // console.lg "found i^fraction " + p
            return true;
        }
    }

    if (is_power(expr) && equaln(cadr(expr), -1) && !is_rat_and_integer(rhs)) {
        // console.lg "found -1^fraction in " + p
        return true;
    }

    if (is_tensor(expr)) {
        for (let i = 0; i < expr.nelem; i++) {
            if (has_clock_form(expr.elem(i), mysteryArg, $)) {
                return true;
            }
        }
        return false;
    }

    if (is_cons(expr)) {
        return [...expr].some((el) => has_clock_form(el, mysteryArg, $));
    }

    return false;
}

/**
 * find stuff like (e)^(i something)
 */
export function has_exp_form(expr: U, $: ExtensionEnv): boolean {

    if (is_cons(expr)) {
        // (expt e (...))
        if (is_power(expr)) {
            const argList_expr = expr.cdr;
            if (is_cons(argList_expr)) {
                const base = argList_expr.car;
                if (is_base_of_natural_logarithm(base)) {
                    const argList_argList_expr = argList_expr.argList;
                    if (is_cons(argList_argList_expr)) {
                        const expo = argList_argList_expr.car;
                        return expo.contains(imu);
                    }
                }
            }
        }

        // Look for same thing embedded in Cons.
        return [...expr].some(function (x) {
            return has_exp_form(x, $);
        });
    }

    // Lok for elements of matrix that contain same thing.
    if (is_tensor(expr)) {
        for (let i = 0; i < expr.nelem; i++) {
            if (has_exp_form(expr.elem(i), $)) {
                return true;
            }
        }
        return false;
    }

    return false;
}
