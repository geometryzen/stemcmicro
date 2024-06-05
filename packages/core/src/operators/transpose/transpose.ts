import { is_num, is_tensor, one, Tensor, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { add, isone, multiply, num_to_number } from "@stemcmicro/helpers";
import { car, cdr, Cons, is_cons, items_to_cons, nil, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { equals } from "../../helpers/equals";
import { inner } from "../../helpers/inner";
import { iszero } from "../../helpers/iszero";
import { is_expanding } from "../../helpers/is_expanding";
import { is_num_and_eq_two } from "../../is";
import { MAXDIM, SYMBOL_IDENTITY_MATRIX, TRANSPOSE } from "../../runtime/constants";
import { halt } from "../../runtime/defs";
import { is_add, is_identity_matrix, is_inner_or_dot, is_multiply, is_transpose } from "../../runtime/helpers";
import { two } from "../../tree/rat/Rat";

/**
 * (transpose a i j)
 */
export function eval_transpose(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const A = $.valueOf(argList.head);
        let I: U = one;
        let J: U = two;
        if (nil !== argList.rest) {
            I = $.valueOf(argList.item1);
            J = $.valueOf(argList.item2);
        }

        return transpose(A, I, J, $);
    } finally {
        argList.release();
    }
}

export function transpose(p1: U, p2: U, p3: U, $: ExprContext): U {
    let t = 0;
    const ai: number[] = Array(MAXDIM).fill(0);
    const an: number[] = Array(MAXDIM).fill(0);

    // a transposition just goes away when applied to a scalar
    if (is_num(p1)) {
        return p1;
    }

    // transposition goes away for identity matrix
    if ((isone(p2, $) && is_num_and_eq_two(p3)) || (isone(p3, $) && is_num_and_eq_two(p2))) {
        if (is_identity_matrix(p1)) {
            return p1;
        }
    }

    // a transposition just goes away when applied to another transposition with
    // the same columns to be switched
    if (is_transpose(p1)) {
        const innerTranspSwitch1 = car(cdr(cdr(p1)));
        const innerTranspSwitch2 = car(cdr(cdr(cdr(p1))));

        if (
            (equals(innerTranspSwitch1, p3, $) && equals(innerTranspSwitch2, p2, $)) ||
            (equals(innerTranspSwitch2, p3, $) && equals(innerTranspSwitch1, p2, $)) ||
            (equals(innerTranspSwitch1, nil, $) && equals(innerTranspSwitch2, nil, $) && ((isone(p3, $) && is_num_and_eq_two(p2)) || (isone(p2, $) && is_num_and_eq_two(p3))))
        ) {
            return car(cdr(p1));
        }
    }

    // if operand is a sum then distribute (if we are in expanding mode)
    if (is_expanding($) && is_add(p1)) {
        // add the dimensions to switch but only if they are not the default ones.
        return p1.tail().reduce((a: U, b: U) => add($, a, transpose(b, p2, p3, $)), zero);
    }

    // if operand is a multiplication then distribute (if we are in expanding mode)
    if (is_expanding($) && is_multiply(p1)) {
        // add the dimensions to switch but only if they are not the default ones.
        return p1.tail().reduce((a: U, b: U) => multiply($, a, transpose(b, p2, p3, $)), one);
    }

    // distribute the transpose of a dot if in expanding mode
    // note that the distribution happens in reverse as per tranpose rules.
    // The dot operator is not commutative, so, it matters.
    if (is_expanding($) && is_inner_or_dot(p1)) {
        const accumulator: U[][] = [];
        if (is_cons(p1)) {
            accumulator.push(...p1.tail().map((p) => [p, p2, p3]));
        }

        accumulator.reverse();
        return accumulator.reduce((acc: U, p: U[]): U => inner(acc, transpose(p[0], p[1], p[2], $), $), SYMBOL_IDENTITY_MATRIX);
    }

    if (!is_tensor(p1)) {
        if (!iszero(p1, $)) {
            //stop("transpose: tensor expected, 1st arg is not a tensor")
            // remove the default "dimensions to be switched"
            // parameters
            if ((!isone(p2, $) || !is_num_and_eq_two(p3)) && (!isone(p3, $) || !is_num_and_eq_two(p2))) {
                return items_to_cons(TRANSPOSE, p1, p2, p3);
            }
            return items_to_cons(TRANSPOSE, p1);
        }
        return zero;
    }

    const { ndim: ndim, nelem: nelem } = p1;

    // is it a vector?
    // so here it's something curious - note how vectors are
    // not really special two-dimensional matrices, but rather
    // 1-dimension objects (like tensors can be). So since
    // they have one dimension, transposition has no effect.
    // (as opposed as if they were special two-dimensional
    // matrices)
    // see also Ran Pan, Tensor Transpose and Its Properties. CoRR abs/1411.1503 (2014)
    if (ndim === 1) {
        return p1;
    }

    let l = num_to_number(p2);
    let m = num_to_number(p3);

    if (l < 1 || l > ndim || m < 1 || m > ndim) {
        halt("transpose: index out of range");
    }

    l--;
    m--;

    const elems = new Array<U>(nelem);

    const dims = p1.copyDimensions();

    dims[l] = p1.dim(m);
    dims[m] = p1.dim(l);

    // const a = p1.elems;
    //const b = retval.elems;

    // init tensor index
    for (let i = 0; i < ndim; i++) {
        ai[i] = 0;
        an[i] = p1.dim(i);
    }

    // copy components from a to b
    for (let i = 0; i < nelem; i++) {
        t = ai[l];
        ai[l] = ai[m];
        ai[m] = t;
        t = an[l];
        an[l] = an[m];
        an[m] = t;

        // convert tensor index to linear index k
        let k = 0;
        for (let j = 0; j < ndim; j++) {
            k = k * an[j] + ai[j];
        }

        // swap indices back
        t = ai[l];
        ai[l] = ai[m];
        ai[m] = t;
        t = an[l];
        an[l] = an[m];
        an[m] = t;

        // copy one element
        elems[k] = p1.elem(i);

        // increment tensor index
        // Suppose the tensor dimensions are 2 and 3.
        // Then the tensor index ai increments as follows:
        // 00 -> 01
        // 01 -> 02
        // 02 -> 10
        // 10 -> 11
        // 11 -> 12
        // 12 -> 00

        for (let j = ndim - 1; j >= 0; j--) {
            if (++ai[j] < an[j]) {
                break;
            }
            ai[j] = 0;
        }
    }

    return new Tensor(dims, elems);
}

export function transpose_factoring(p1: U, p2: U, p3: U, $: ExprContext): U {
    $.pushDirective(Directive.factoring, 1);
    try {
        return transpose(p1, p2, p3, $);
    } finally {
        $.popDirective();
    }
}
