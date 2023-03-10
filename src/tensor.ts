import { ExtensionEnv } from './env/ExtensionEnv';
import { inv } from './inv';
import { makeList } from './makeList';
import { nativeInt } from './nativeInt';
import { derivative } from './operators/derivative/derivative';
import { MATH_DERIVATIVE } from './operators/derivative/MATH_DERIVATIVE';
import { MAXDIM, POWER } from './runtime/constants';
import { Err } from './tree/err/Err';
import { one, zero } from './tree/rat/Rat';
import { Sym } from './tree/sym/Sym';
import { create_tensor_elements_diagonal } from './tree/tensor/create_tensor_elements';
import { is_tensor } from './operators/tensor/is_tensor';
import { Tensor } from './tree/tensor/Tensor';
import { Cons, U } from './tree/tree';

//-----------------------------------------------------------------------------
//
// careful not to reorder factors
//
// If we treat symbols as scalars we could run foul of anti-commuting algebras.
//
//-----------------------------------------------------------------------------
export function tensor_x_other(lhs: Tensor, rhs: U, $: ExtensionEnv): U {
    return lhs.map(function (elem) {
        return $.multiply(elem, rhs);
    });
}

export function other_x_tensor(lhs: U, rhs: Tensor, $: ExtensionEnv): U {
    return rhs.map(function (elem) {
        return $.multiply(lhs, elem);
    });
}

/**
 * Determines whether the expression is a square matrix.
 * To be a square matrix, it must be a tensor with two dimensions, with the sizes of each dimension being equal.
 */
export function is_square_matrix(expr: U): expr is Tensor & { ndim: 2; square: true } {
    return is_tensor(expr) && is_square_matrix_tensor(expr);
}

export function is_square_matrix_tensor(tensor: Tensor): tensor is Tensor & { ndim: 2; square: true } {
    return tensor.ndim === 2 && tensor.dim(0) === tensor.dim(1);
}

/**
 * Asserts that m is a square matrix and returns the number of rows. 
 * @param expr The expression that is asserted to be a square matrix.
 */
export function assert_square_matrix(expr: U, $: ExtensionEnv): number | never {
    if (is_square_matrix(expr)) {
        return expr.dim(0);
    }
    else {
        throw new Error(`${$.toInfixString(expr)} MUST be a square matrix.`);
    }
}

export function assert_square_matrix_tensor(tensor: Tensor, $: ExtensionEnv): number | never {
    if (is_square_matrix_tensor(tensor)) {
        return tensor.dim(0);
    }
    else {
        throw new Error(`tensor => ${$.toInfixString(tensor)} MUST be a square matrix. ${tensor} ndim=${tensor.ndim}`);
    }
}

//-----------------------------------------------------------------------------
//
//  gradient of tensor
//
//-----------------------------------------------------------------------------
export function d_tensor_tensor(p1: Tensor, p2: Tensor, $: ExtensionEnv): U {

    if (p1.ndim + 1 >= MAXDIM) {
        return makeList(MATH_DERIVATIVE, p1, p2);
    }

    const sizes = p1.copyDimensions();
    sizes.push(p2.dim(0));

    const iLen = p1.nelem;
    const jLen = p2.nelem;
    const elems = new Array<U>(iLen * jLen);
    for (let i = 0; i < iLen; i++) {
        for (let j = 0; j < jLen; j++) {
            elems[i * jLen + j] = derivative(p1.elem(i), p2.elem(j), $);
        }
    }
    return new Tensor(sizes, elems);
}

//-----------------------------------------------------------------------------
//
//  gradient of scalar
//
//-----------------------------------------------------------------------------
export function d_scalar_tensor(p1: U, p2: Tensor, $: ExtensionEnv): U {
    const sizes = [p2.dim(0)];
    const elems = p2.mapElements((elem) => derivative(p1, elem, $));
    return new Tensor(sizes, elems);
}

//-----------------------------------------------------------------------------
//
//  Derivative of tensor
//
//-----------------------------------------------------------------------------
export function d_tensor_scalar(p1: Tensor, p2: U, $: ExtensionEnv): U {
    const elems = p1.mapElements((elem) => derivative(elem, p2, $));
    return p1.withElements(elems);
}

//-----------------------------------------------------------------------------
//
//  Raise a tensor to a power
//
//  Input:    p1  tensor
//            p2  exponent
//
//  Output:    Result
//
//-----------------------------------------------------------------------------
export function power_tensor(p1: Tensor, p2: U, $: ExtensionEnv): Cons | Sym | Tensor | Err {
    // first and last dims must be equal
    const k = p1.ndim - 1;

    if (p1.dim(0) !== p1.dim(k)) {
        return makeList(POWER, p1, p2);
    }

    let n = nativeInt(p2);

    if (isNaN(n)) {
        return makeList(POWER, p1, p2);
    }

    if (n === 0) {
        if (p1.ndim !== 2) {
            throw new Error('power(tensor,0) with tensor rank not equal to 2');
        }
        n = p1.dim(0);
        // p1 = create_mat(n * n);
        const sizes = [n, n];
        const elems = create_tensor_elements_diagonal(n, one, zero);

        // TODO: I think p1 has to be square, in which case we can use p1.withElements(elems).
        return new Tensor(sizes, elems);
    }

    let p3: Cons | Sym | Tensor | Err = p1;
    if (n < 0) {
        n = -n;
        p3 = inv(p3, $);
    }

    let prev: U = p3;
    for (let i = 1; i < n; i++) {
        prev = $.inner(prev, p3);
        if ($.is_zero(prev)) {
            break;
        }
    }
    return prev as Tensor;
}

// Tensors with elements that are also tensors get promoted to a higher rank.
export function promote_tensor(p1: U): U {
    if (!is_tensor(p1)) {
        return p1;
    }

    const p2 = p1.elem(0);

    if (p1.someElements((elem) => !compatible(p2, elem))) {
        throw new Error('Cannot promote tensor due to inconsistent tensor components.');
    }

    if (!is_tensor(p2)) {
        return p1;
    }

    const ndim = p1.ndim + p2.ndim;
    if (ndim > MAXDIM) {
        throw new Error('tensor rank > ' + MAXDIM);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dims = [...p1.copyDimensions(), ...p2.copyDimensions()];
    throw new Error("TODO: promote_tensor");
    // Not sure why this doesn't compile.
    // TODO: I have since learned that the elements of the tensor are flattened.
    /*
    const elems = [].concat(
      ...p1.mapElements((el: Tensor) => el.copyElements())
    );
  
    return new Tensor(dims, elems);
    */
}

function compatible(p: U, q: U): boolean {
    if (!is_tensor(p) && !is_tensor(q)) {
        return true;
    }

    if (!is_tensor(p) || !is_tensor(q)) {
        return false;
    }

    if (p.ndim !== q.ndim) {
        return false;
    }

    for (let i = 0; i < p.ndim; i++) {
        if (p.dim(i) !== q.dim(i)) {
            return false;
        }
    }

    return true;
}
