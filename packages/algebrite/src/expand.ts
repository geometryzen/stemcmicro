import { create_int, is_tensor, one, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { guess, inverse, is_add, is_multiply, is_power, multiply_items, num_to_number } from "@stemcmicro/helpers";
import { caddr, cadr, Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "./env/ExtensionEnv";
import { factors } from "./factors";
import { filter } from "./filter";
import { divide_expand } from "./helpers/divide";
import { inv } from "./inv";
import { is_plus_or_minus_one, is_poly_expanded_form } from "./is";
import { multiply_binary } from "./multiply";
import { degree } from "./operators/degree/degree";
import { denominator } from "./operators/denominator/denominator";
import { factorize } from "./operators/factor/factor";
import { numerator } from "./operators/numerator/numerator";
import { quotient } from "./quotient";
import { doexpand_binary, doexpand_unary } from "./runtime/defs";

// Partial fraction expansion
//
// Example
//
//      expand(1/(x^3+x^2),x)
//
//        1      1       1
//      ---- - --- + -------
//        2     x     x + 1
//       x
export function eval_expand(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    const arg1 = $.valueOf(argList.head);
    const arg2 = $.valueOf(argList.argList.head);
    const F = arg1;
    const X = arg2.isnil ? guess(F) : arg2;
    return expand(F, X, $);
}

//define A p2
//define B p3
//define C p4
//define F p5
//define P p6
//define Q p7
//define T p8
//define X p9

function expand(F: U, X: U, $: ExtensionEnv): U {
    if (is_tensor(F)) {
        return expand_tensor(F, X, $);
    }

    // if sum of terms then sum over the expansion of each term
    if (is_add(F)) {
        return F.tail().reduce((a: U, b: U) => $.add(a, expand(b, X, $)), zero);
    }

    let B = numerator(F, $);
    let A = denominator(F, $);

    [A, B] = remove_negative_exponents(A, B, X, $);

    // if the denominator is one then always bail out
    // also bail out if the denominator is not one but
    // it's not anything recognizable as a polynomial.
    if (is_plus_or_minus_one(B, $) || is_plus_or_minus_one(A, $)) {
        if (!is_poly_expanded_form(A, X) || is_plus_or_minus_one(A, $)) {
            return F;
        }
    }

    // Q = quotient
    const Q = quotient(B, A, X, $);

    // remainder B = B - A * Q
    B = $.subtract(B, $.multiply(A, Q));

    // if the remainder is zero then we're done
    if ($.iszero(B)) {
        return Q;
    }

    // A = factor(A)
    A = factorize(A, X, $);

    const C = expand_get_C(A, X, $);
    B = expand_get_B(B, C, X, $);
    A = expand_get_A(A, C, X, $);

    let result: U;
    if (is_tensor(C)) {
        const inverse = doexpand_unary(inv, C, $);
        result = $.inner($.inner(inverse, B), A);
    } else {
        const arg1 = divide_expand(B, C, $);
        result = $.multiply(arg1, A);
    }
    return $.add(result, Q);
}

function expand_tensor(p5: Tensor, p9: U, $: ExtensionEnv): U {
    return p5.map(function (el) {
        return expand(el, p9, $);
    });
}

function remove_negative_exponents(p2: U, p3: U, p9: U, $: ExtensionEnv): [U, U] {
    const arr = [...factors(p2), ...factors(p3)];
    // find the smallest exponent
    let j = 0;
    for (let i = 0; i < arr.length; i++) {
        const p1 = arr[i];
        if (!is_power(p1)) {
            continue;
        }
        if (!cadr(p1).equals(p9)) {
            continue;
        }
        const k = num_to_number(caddr(p1));
        if (isNaN(k)) {
            continue;
        }
        if (k < j) {
            j = k;
        }
    }

    if (j === 0) {
        return [p2, p3];
    }

    // A = A / X^j
    p2 = $.multiply(p2, $.power(p9, create_int(-j)));

    // B = B / X^j
    p3 = $.multiply(p3, $.power(p9, create_int(-j)));

    return [p2, p3];
}

// Returns the expansion coefficient matrix C.
//
// Example:
//
//       B         1
//      --- = -----------
//       A      2
//             x (x + 1)
//
// We have
//
//       B     Y1     Y2      Y3
//      --- = ---- + ---- + -------
//       A      2     x      x + 1
//             x
//
// Our task is to solve for the unknowns Y1, Y2, and Y3.
//
// Multiplying both sides by A yields
//
//           AY1     AY2      AY3
//      B = ----- + ----- + -------
//            2      x       x + 1
//           x
//
// Let
//
//            A               A                 A
//      W1 = ----       W2 = ---        W3 = -------
//             2              x               x + 1
//            x
//
// Then the coefficient matrix C is
//
//              coeff(W1,x,0)   coeff(W2,x,0)   coeff(W3,x,0)
//
//       C =    coeff(W1,x,1)   coeff(W2,x,1)   coeff(W3,x,1)
//
//              coeff(W1,x,2)   coeff(W2,x,2)   coeff(W3,x,2)
//
// It follows that
//
//       coeff(B,x,0)     Y1
//
//       coeff(B,x,1) = C Y2
//
//       coeff(B,x,2) =   Y3
//
// Hence
//
//       Y1       coeff(B,x,0)
//             -1
//       Y2 = C   coeff(B,x,1)
//
//       Y3       coeff(B,x,2)
function expand_get_C(p2: U, p9: U, $: ExtensionEnv): U {
    const stack: U[] = [];
    if (is_multiply(p2)) {
        p2.tail().forEach((p5) => stack.push(...expand_get_CF(p2, p5, p9, $)));
    } else {
        stack.push(...expand_get_CF(p2, p2, p9, $));
    }
    const n = stack.length;
    if (n === 1) {
        return stack[0];
    }
    const dims = [n, n];
    const elems = new Array<U>(n * n);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const arg2 = $.power(p9, create_int(i));
            const divided = divide_expand(stack[j], arg2, $);
            elems[n * i + j] = filter(divided, p9, $);
        }
    }
    return new Tensor(dims, elems);
}

// The following table shows the push order for simple roots, repeated roots,
// and inrreducible factors.
//
//  Factor F        Push 1st        Push 2nd         Push 3rd      Push 4th
//
//
//                   A
//  x               ---
//                   x
//
//
//   2               A               A
//  x               ----            ---
//                    2              x
//                   x
//
//
//                     A
//  x + 1           -------
//                   x + 1
//
//
//         2            A              A
//  (x + 1)         ----------      -------
//                          2        x + 1
//                   (x + 1)
//
//
//   2                   A               Ax
//  x  + x + 1      ------------    ------------
//                    2               2
//                   x  + x + 1      x  + x + 1
//
//
//    2         2          A              Ax              A             Ax
//  (x  + x + 1)    --------------- ---------------  ------------  ------------
//                     2         2     2         2     2             2
//                   (x  + x + 1)    (x  + x + 1)     x  + x + 1    x  + x + 1
//
//
// For T = A/F and F = P^N we have
//
//
//      Factor F          Push 1st    Push 2nd    Push 3rd    Push 4th
//
//      x                 T
//
//       2
//      x                 T           TP
//
//
//      x + 1             T
//
//             2
//      (x + 1)           T           TP
//
//       2
//      x  + x + 1        T           TX
//
//        2         2
//      (x  + x + 1)      T           TX          TP          TPX
//
//
// Hence we want to push in the order
//
//      T * (P ^ i) * (X ^ j)
//
// for all i, j such that
//
//      i = 0, 1, ..., N - 1
//
//      j = 0, 1, ..., deg(P) - 1
//
// where index j runs first.
function expand_get_CF(p2: U, p5: U, p9: U, $: ExtensionEnv): U[] {
    let p6: U;
    let n = 0;

    if (!p5.contains(p9)) {
        return [];
    }
    const p8 = doexpand_binary(trivial_divide, p2, p5, $);
    if (is_power(p5)) {
        n = num_to_number(p5.expo);
        p6 = p5.base;
    } else {
        n = 1;
        p6 = p5;
    }
    const stack: U[] = [];
    const d = num_to_number(degree(p6, p9));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < d; j++) {
            const arg6 = $.power(p6, create_int(i));
            const arg8 = doexpand_binary(multiply_binary, p8, arg6, $);
            const arg9 = $.power(p9, create_int(j));
            const multiplied = doexpand_binary(multiply_binary, arg8, arg9, $);
            stack.push(multiplied);
        }
    }

    return stack;
}

// Returns T = A/F where F is a factor of A.
function trivial_divide(p2: U, p5: U, $: ExprContext): U {
    let result: U = one;
    if (is_multiply(p2)) {
        const arr: U[] = [];
        p2.tail().forEach((p0) => {
            if (!p0.equals(p5)) {
                // force expansion of (x+1)^2, f.e.
                arr.push($.valueOf(p0));
            }
        });
        result = multiply_items(arr, $);
    }
    return result;
}

// Returns the expansion coefficient vector B.
function expand_get_B(p3: U, p4: U, p9: U, $: ExtensionEnv): U {
    if (!is_tensor(p4)) {
        return p3;
    }
    const n = p4.dim(0);
    const dims = [n];
    const elems = new Array<U>(n);
    for (let i = 0; i < n; i++) {
        const arg2 = $.power(p9, create_int(i));
        const divided = divide_expand(p3, arg2, $);
        elems[i] = filter(divided, p9, $);
    }
    return new Tensor(dims, elems);
}

// Returns the expansion fractions in A.
function expand_get_A(p2: U, p4: U, X: U, $: ExtensionEnv): U {
    if (!is_tensor(p4)) {
        return inverse(p2, $);
    }
    let elements: U[] = [];
    if (is_multiply(p2)) {
        p2.tail().forEach((p5) => {
            elements.push(...expand_get_AF(p5, X, $));
        });
    } else {
        elements = expand_get_AF(p2, X, $);
    }
    const n = elements.length;
    const dims = [n];
    return new Tensor(dims, elements);
}

function expand_get_AF(p5: U, X: U, $: ExtensionEnv): U[] {
    let n = 1;
    if (!p5.contains(X)) {
        return [];
    }
    if (is_power(p5)) {
        n = num_to_number(p5.expo);
        p5 = p5.base;
    }
    const results: U[] = [];
    const d = num_to_number(degree(p5, X));
    for (let i = n; i > 0; i--) {
        for (let j = 0; j < d; j++) {
            const A = $.power(p5, create_int(i));
            const B = inverse(A, $);
            const C = $.power(X, create_int(j));
            results.push($.multiply(B, C));
        }
    }
    return results;
}
