import { Err, is_tensor, one, Sym, Tensor, zero } from 'math-expression-atoms';
import { Cons, is_cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from './env/ExtensionEnv';
import { divide } from './helpers/divide';
import { det } from './operators/det/det';
import { adj } from './operators/tensor/tensor_extension';
import { INV, INVG } from './runtime/constants';
import { halt } from './runtime/defs';
import { is_identity_matrix, is_inner_or_dot, is_num_or_tensor_or_identity_matrix, is_opr_eq_inv } from './runtime/helpers';
import { is_square_matrix } from './tensor';

//-----------------------------------------------------------------------------
//
//  Input:    Matrix (must have two dimensions but it can be non-numerical)
//
//  Output:    Inverse
//
//  Example:
//
//  > inv(((1,2),(3,4))
//  ((-2,1),(3/2,-1/2))
//
//  > inv(((a,b),(c,d))
//  ((d / (a d - b c),-b / (a d - b c)),(-c / (a d - b c),a / (a d - b c)))
//
//  Note:
//
//  THIS IS DIFFERENT FROM INVERSE OF AN EXPRESSION (inv)
//   Uses Gaussian elimination for numerical matrices.
//
//-----------------------------------------------------------------------------
export function inv(expr: U, $: ExtensionEnv): Cons | Sym | Tensor | Err {
    const hook = function (retval: Cons | Sym | Tensor | Err): Cons | Sym | Tensor | Err {
        // console.lg(`inv of ${$.toInfixString(p1)} => ${$.toInfixString(retval)}`);
        return retval;
    };

    // an inv just goes away when applied to another inv
    if (is_cons(expr) && is_opr_eq_inv(expr)) {
        return expr.argList;
    }

    // inverse goes away in case of identity matrix
    if (is_identity_matrix(expr)) {
        return hook(expr);
    }

    // distribute the inverse of a dot if in expanding mode
    // note that the distribution happens in reverse.
    // The dot operator is not commutative, so, it matters.
    if ($.isExpanding() && is_inner_or_dot(expr)) {

        const accumulator = is_cons(expr) ? expr.tail() : [];

        const inverses: U[] = accumulator.map(function (x) {
            return inv(x, $);
        });
        for (let i = inverses.length - 1; i > 0; i--) {
            inverses[i - 1] = $.inner(inverses[i], inverses[i - 1]);
        }

        return hook(inverses[0] as Tensor);
    }

    if (is_tensor(expr) && is_square_matrix(expr)) {
        // Fall through.
    }
    else {
        return hook(items_to_cons(INV, expr));
    }

    if (is_num_or_tensor_or_identity_matrix(expr)) {
        return hook(inverse_tensor(expr, $));
    }

    const p2 = det(expr, $);
    if ($.iszero(p2)) {
        halt('inverse of singular matrix');
    }
    return hook(divide(adj(expr, $), p2, $) as Tensor);
}

export function invg(expr: U, $: ExtensionEnv): Cons | Sym | Tensor {
    if (is_tensor(expr) && is_square_matrix(expr)) {
        return inverse_tensor(expr, $);
    }
    else {
        return items_to_cons(INVG, expr);
    }
}

// inverse using gaussian elimination
function inverse_tensor(M: Tensor, $: ExtensionEnv): Tensor {
    const n = M.dim(0);

    // create an identity matrix
    const units: U[] = new Array(n * n);
    units.fill(zero);
    for (let i = 0; i < n; i++) {
        units[i * n + i] = one;
    }

    const inverse = INV_decomp(units, M.copyElements(), n, $);

    return new Tensor([n, n], inverse);
}

//-----------------------------------------------------------------------------
//
//  Input:    n * n unit matrix
//            n * n operand
//
//  Output:    n * n inverse matrix
//
//-----------------------------------------------------------------------------
function INV_decomp(units: U[], elements: U[], n: number, $: ExtensionEnv): U[] {
    for (let d = 0; d < n; d++) {
        if ($.equals(elements[n * d + d], zero)) {
            let i = 0;
            for (i = d + 1; i < n; i++) {
                if (!$.equals(elements[n * i + d], zero)) {
                    break;
                }
            }

            if (i === n) {
                halt('inverse of singular matrix');
            }

            // exchange rows
            for (let j = 0; j < n; j++) {
                let p2 = elements[n * d + j];
                elements[n * d + j] = elements[n * i + j];
                elements[n * i + j] = p2;

                p2 = units[n * d + j];
                units[n * d + j] = units[n * i + j];
                units[n * i + j] = p2;
            }
        }

        // multiply the pivot row by 1 / pivot
        const p2 = elements[n * d + d];

        for (let j = 0; j < n; j++) {
            if (j > d) {
                elements[n * d + j] = divide(elements[n * d + j], p2, $);
            }

            units[n * d + j] = divide(units[n * d + j], p2, $);
        }

        for (let i = 0; i < n; i++) {
            if (i === d) {
                continue;
            }

            // multiplier
            const p2 = elements[n * i + d];

            for (let j = 0; j < n; j++) {
                if (j > d) {
                    elements[n * i + j] = $.subtract(elements[n * i + j], $.multiply(elements[n * d + j], p2));
                }
                units[n * i + j] = $.subtract(units[n * i + j], $.multiply(units[n * d + j], p2));
            }
        }
    }
    return units;
}
