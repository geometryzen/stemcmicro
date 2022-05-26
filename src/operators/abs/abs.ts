import { complex_conjugate } from '../../complex_conjugate';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { imu } from '../../env/imu';
import { exp } from '../../exp';
import { imag } from '../../imag';
import { equaln, is_negative_number, is_negative_term, is_num_and_gt_zero } from '../../is';
import { makeList } from '../../makeList';
import { is_base_of_natural_logarithm } from '../../predicates/is_base_of_natural_logarithm';
import { real } from '../../real';
import { rect } from '../rect/rect';
import { PI } from '../../runtime/constants';
import { DynamicConstants } from '../../runtime/defs';
import { has_clock_form, has_exp_form } from '../../runtime/find';
import { is_abs, is_add, is_multiply, is_power } from '../../runtime/helpers';
import { caddr, cadr } from '../../tree/helpers';
import { half, one, two, zero } from '../../tree/rat/Rat';
import { is_tensor } from '../../tree/tensor/is_tensor';
import { Tensor } from '../../tree/tensor/Tensor';
import { car, is_cons, U } from '../../tree/tree';
import { simplify, simplify_trig } from '../simplify/simplify';
import { MATH_ABS } from './MATH_ABS';

//(docs are generated from top-level comments, keep an eye on the formatting!)

/* abs =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the absolute value of a real number, the magnitude of a complex number, or the vector length.

*/

/*
 Absolute value of a number,or magnitude of complex z, or norm of a vector

  z    abs(z)
  -    ------

  a    a

  -a    a

  (-1)^a    1

  exp(a + i b)  exp(a)

  a b    abs(a) abs(b)

  a + i b    sqrt(a^2 + b^2)

Notes

  1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)

  2. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then

    abs(numerator(z)) / abs(denominator(z))

     must be used to get the correct answer. Now the operation is
     automatic.
*/

/**
 * We take the general view that expr is a vector of an inner product space. Every inner product gives rise to a norm,
 * called the canonical or induced norm, where the norm of a vector v is defined by:
 * 
 * abs(v) = sqrt(inner(v, v))
 * 
 * For real numbers, the inner product of v with itself reduces to the square of v.
 * For complex numbers, the inner product requires taking the conjugate of the second.
 * For our use of tensors as a vector, we also take the conjugate of the second.
 * 
 * https://en.wikipedia.org/wiki/Inner_product_space
 * 
 * For real numbers,    inner(x,y) = x * y
 * For complex numbers, inner(x,y) = x * conj(y) 
 * 
 */
/*
export function abs(x: U, $: ExtensionEnv): U {
    console.log(`abs x=${print_list(x, $)}`);
    const A = $.inner(x, x);
    console.log(`A=${print_list(A, $)}`);
    const B = $.power(A, half);
    return B;
}
*/

// Keep the following function for reference.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function abs(x: U, $: ExtensionEnv): U {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hook = function (retval: U, description: string): U {
        return retval;
    };

    const expr: U = x;

    if ($.isZero(expr)) {
        return hook(zero, "A");
    }

    if ($.isOne(expr)) {
        return hook(one, "B");
    }

    if (is_negative_number(expr)) {
        return hook($.negate(expr), "C");
    }

    if (is_num_and_gt_zero(expr)) {
        return hook(expr, "D");
    }

    if (PI.equals(expr)) {
        return hook(expr, "E");
    }

    // ??? should there be a shortcut case here for the imaginary unit?

    // now handle decomposition cases ----------------------------------------------

    // we catch the "add", "power", "multiply" cases first,
    // before falling back to the
    // negative/positive cases because there are some
    // simplification thay we might be able to do.
    // Note that for this routine to give a correct result, this
    // must be a sum where a complex number appears.
    // If we apply this to "a+b", we get an incorrect result.
    if (is_cons(expr) && is_add(expr)) {
        if (has_clock_form(expr, expr, $) || has_exp_form(expr, $) || expr.contains(imu)) {

            const z = rect(expr, $); // convert polar terms, if any

            // console.lg(`z => ${$.toInfixString(z)}`)

            const x = real(z, $);
            const y = imag(z, $);
            const xx = $.power(x, two);
            const yy = $.power(y, two);
            const zz = $.add(xx, yy);
            const abs_z = $.power(zz, half);
            // console.lg(`x => ${$.toInfixString(x)}`)
            // console.lg(`y => ${$.toInfixString(y)}`)
            return hook(simplify_trig(abs_z, $), "F");
        }
    }

    // TODO: This can be generalized e.g. to Tensor, Vec.
    // abs(x) = sqrt(x*x), so we should ask if x squares to 1.
    // If it does, return a one of the same shape.
    // const xx = square(expr,$)
    // $.isOne(xx);
    // const ext = $.extensionOf(expr);
    // const correctly_typed_one = ext.one(expr, $) 
    // (abs (power -1 Unknown)) => 1
    // abs(-1^anything) = abs(-1)^anything = 1^anything = 1
    if (is_cons(expr) && is_power(expr) && equaln(car(expr.cdr), -1)) {
        // -1 to any power
        return hook(DynamicConstants.One(), "G");
    }

    // abs(base^expo) is equal to abs(base)^expo IF expo is positive
    if (is_cons(expr) && is_power(expr)) {
        const expo = caddr(expr);
        if (is_num_and_gt_zero(expo)) {
            const base = cadr(expr);
            const abs_base = abs(base, $);
            return hook($.power(abs_base, expo), "H");
        }
    }

    // abs(e^something)
    const base = cadr(expr);
    if (is_power(expr) && is_base_of_natural_logarithm(base)) {
        // exponential
        return hook(exp(real(caddr(expr), $), $), "I");
    }

    if (is_multiply(expr)) {
        // product
        return hook(expr.tail().map(function (x) {
            return abs(x, $);
        }).reduce($.multiply), "J");
    }

    // abs(abs(x)) => abs(x) (abs is a projection operator).
    if (is_cons(expr) && is_abs(expr)) {
        return hook(expr, "K");
    }

    if (is_tensor(expr)) {
        const retval = abs_tensor(expr, $);
        return hook(retval, "L");
    }

    if (is_negative_term(expr) || (is_cons(expr) && is_add(expr) && is_negative_term(cadr(expr)))) {
        const neg_expr = $.negate(expr);
        return hook(makeList(MATH_ABS, neg_expr), "M");
    }

    // But we haven't handled the sum of terms.
    if (is_cons(expr) && is_add(expr)) {
        // TODO: This should probably be the implementation in all cases.
        // Everything else is just an optimization.
        // By selecting only sums of terms, we are narrowing ourselves down to
        // trying to remove the abs function by applying the Cauchy-Schwartz equality,
        // hoping for the case that all terms are positive.
        // https://en.wikipedia.org/wiki/Cauchy%E2%80%93Schwarz_inequality
        return hook($.valueOf(simplify($.power($.inner(expr, expr), half), $)), "N");
    }
    else {
        // Here we have given up and simply wrap the expression.
        // Perhaps the real question is whether expr is a vector in an inner product space.
        return hook(makeList(MATH_ABS, expr), "O");
    }
}

// also called the "norm" of a vector
function abs_tensor(M: Tensor, $: ExtensionEnv): U {
    if (M.ndim !== 1) {
        throw new Error('abs(tensor) with tensor rank > 1');
    }
    // 
    const K = simplify(M, $);
    // TODO: We need to be careful here. The conjugate operation really belongs inside the inner operation for tensors.
    return $.valueOf(simplify($.power($.inner(K, complex_conjugate(K, $)), half), $));
}
