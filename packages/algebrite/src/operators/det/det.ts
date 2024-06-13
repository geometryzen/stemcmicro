import { assert_tensor, create_int, is_num, one, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { add, divide, multiply, negate } from "@stemcmicro/helpers";
import { items_to_cons, U } from "@stemcmicro/tree";
import { Sign } from "../../env/ExtensionEnv";
import { equals } from "../../helpers/equals";
import { DET } from "../../runtime/constants";
import { is_square_matrix } from "../../tensor";

export function det(m: Tensor, env: ExprContext): U {
    assert_tensor(m);

    const hook = function (retval: U): U {
        return retval;
    };

    if (is_square_matrix(m)) {
        const elems = m.copyElements();
        const is_numeric = elems.every((element) => is_num(element));
        if (is_numeric) {
            return hook(determinant_numeric(m, env));
        } else {
            return hook(determinant_symbolic(elems, m.dim(0), env));
        }
    } else {
        // console.lg(`must be square M=${print_expr(M, $)}`);
        return hook(items_to_cons(DET, m));
    }
}

// determinant of n * n matrix elements on the stack
export function determinant_symbolic(elements: readonly U[], n: number, $: Pick<ExprContext, "valueOf">): U {
    if (n === 0) {
        // The remainder of this code should do this!
        return one;
    }

    let q = 0;
    const a: number[] = [];

    for (let i = 0; i < n; i++) {
        a[i] = i;
        a[i + n] = 0;
        a[i + n + n] = 1;
    }

    let sign_: Sign = 1;

    let outerTemp: U = zero;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        let temp: U = create_int(sign_);
        for (let i = 0; i < n; i++) {
            const k = n * a[i] + i;
            temp = multiply($, temp, elements[k]); // FIXME -- problem here
        }

        outerTemp = add($, outerTemp, temp);

        // next permutation (Knuth's algorithm P)
        let j = n - 1;
        let s = 0;

        let break_from_outer_loop = false;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            q = a[n + j] + a[n + n + j];
            if (q < 0) {
                a[n + n + j] = -a[n + n + j];
                j--;
                continue;
            }
            if (q === j + 1) {
                if (j === 0) {
                    break_from_outer_loop = true;
                    break;
                }
                s++;
                a[n + n + j] = -a[n + n + j];
                j--;
                continue;
            }
            break;
        }

        if (break_from_outer_loop) {
            break;
        }

        const t = a[j - a[n + j] + s];
        a[j - a[n + j] + s] = a[j - q + s];
        a[j - q + s] = t;
        a[n + j] = q;

        sign_ = sign_ === 1 ? -1 : 1;
    }

    return outerTemp;
}

/**
 * Uses Gaussian elimination which is faster for numerical matrices.
 *
 * @param m
 * @param $
 * @returns
 */
function determinant_numeric(m: Tensor, $: ExprContext): U {
    const n = m.dim(0);
    const elements = m.copyElements();
    const decomp = lu_decomp(elements, n, $);
    return decomp;
}

function getM(arr: U[], n: number, i: number, j: number): U {
    return arr[n * i + j];
}

function setM(arr: U[], n: number, i: number, j: number, value: U) {
    arr[n * i + j] = value;
}

//-----------------------------------------------------------------------------
//
//  Input:    n * n matrix elements
//
//  Output:    upper diagonal matrix
//
//-----------------------------------------------------------------------------
function lu_decomp(elements: U[], n: number, $: ExprContext): U {
    let p1: U = one;

    for (let d = 0; d < n - 1; d++) {
        if (equals(getM(elements, n, d, d), zero, $)) {
            let i = 0;
            for (i = d + 1; i < n; i++) {
                if (!equals(getM(elements, n, i, d), zero, $)) {
                    break;
                }
            }

            if (i === n) {
                p1 = zero;
                break;
            }

            // exchange rows
            for (let j = d; j < n; j++) {
                const p2 = getM(elements, n, d, j);
                setM(elements, n, d, j, getM(elements, n, i, j));
                setM(elements, n, i, j, p2);
            }

            // negate det
            p1 = negate($, p1);
        }

        // update det
        p1 = multiply($, p1, getM(elements, n, d, d));

        // update lower diagonal matrix
        for (let i = d + 1; i < n; i++) {
            const p2 = negate($, divide(getM(elements, n, i, d), getM(elements, n, d, d), $));

            // update one row
            setM(elements, n, i, d, zero); // clear column below pivot d

            for (let j = d + 1; j < n; j++) {
                const added = add($, multiply($, getM(elements, n, d, j), p2), getM(elements, n, i, j));
                setM(elements, n, i, j, added);
            }
        }
    }

    // last diagonal element
    return multiply($, p1, getM(elements, n, n - 1, n - 1));
}
