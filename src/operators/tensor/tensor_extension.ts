import { Extension, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_TENSOR } from "../../hashing/hash_info";
import { to_infix_string } from "../../print/to_infix_string";
import { MAXDIM } from "../../runtime/constants";
import { Tensor } from "../../tree/tensor/Tensor";
import { Cons, nil, U } from "../../tree/tree";
import { ExtensionOperatorBuilder } from "../helpers/ExtensionOperatorBuilder";
import { subst } from "../subst/subst";
import { is_tensor } from "./is_tensor";

function equal_elements(as: U[], bs: U[], $: ExtensionEnv): boolean {
    const length = as.length;
    for (let i = 0; i < length; i++) {
        const cmp = $.equals(as[i], bs[i]);
        if (!cmp) {
            return false;
        }
    }
    return true;
}

export function equal_mat_mat(p1: Tensor, p2: Tensor, $: ExtensionEnv): boolean {
    if (p1.rank < p2.rank) {
        return false;
    }

    if (p1.rank > p2.rank) {
        return false;
    }

    for (let i = 0; i < p1.rank; i++) {
        if (p1.dim(i) < p2.dim(i)) {
            return false;
        }
        if (p1.dim(i) > p2.dim(i)) {
            return false;
        }
    }

    for (let i = 0; i < p1.nelem; i++) {
        const cmp = $.equals(p1.elem(i), p2.elem(i));
        if (!cmp) {
            return false;
        }
    }

    return true;
}

export function add_tensor_tensor(A: Tensor, B: Tensor, $: ExtensionEnv): Cons | Tensor {
    if (!A.sameDimensions(B)) {
        return nil;
    }
    return A.map(function (a, i) {
        return $.add(a, B.elem(i));
    });
}

export function outer_tensor_tensor(lhs: Tensor, rhs: Tensor, $: ExtensionEnv): Tensor {
    const ndim = lhs.rank + rhs.rank;
    if (ndim > MAXDIM) {
        throw new Error('outer: rank of result exceeds maximum');
    }

    const sizes = [...lhs.copyDimensions(), ...rhs.copyDimensions()];

    let k = 0;
    const iLen = lhs.nelem;
    const jLen = rhs.nelem;
    const elems = new Array<U>(iLen * jLen);
    for (let i = 0; i < iLen; i++) {
        for (let j = 0; j < jLen; j++) {
            elems[k++] = $.multiply(lhs.elem(i), rhs.elem(j));
        }
    }
    return new Tensor(sizes, elems);
}

class TensorExtension implements Extension<Tensor> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(private readonly $: ExtensionEnv) {
        // Nothing to see here.
    }
    get key(): string {
        return HASH_TENSOR;
    }
    get hash(): string {
        return HASH_TENSOR;
    }
    get name(): string {
        return 'TensorExtension';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isImag(expr: Tensor): boolean {
        return false;
    }
    isKind(arg: unknown): arg is Tensor {
        return arg instanceof Tensor;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isMinusOne(arg: Tensor): boolean {
        // TODO: What about the square matrix identity element for multiplication? 
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isOne(arg: Tensor): boolean {
        // TODO: What about the square matrix identity element for multiplication? 
        return false;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isReal(expr: Tensor): boolean {
        return false;
    }
    isScalar(): boolean {
        return false;
    }
    isVector(): boolean {
        return false;
    }
    isZero(arg: Tensor, $: ExtensionEnv): boolean {
        return arg.everyElement(function (element) {
            return $.isZero(element);
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    one(zero: Tensor, $: ExtensionEnv): Tensor {
        throw new Error();
    }
    subst(expr: Tensor, oldExpr: U, newExpr: U, $: ExtensionEnv): U {
        if (is_tensor(oldExpr) && expr.equals(oldExpr)) {
            return newExpr;
        }
        const elems = expr.mapElements((elem) => {
            const result = subst(elem, oldExpr, newExpr, $);
            return result;
        });
        if (equal_elements(expr.copyElements(), elems, $)) {
            return expr;
        }
        else {
            return expr.withElements(elems);
        }
    }
    toInfixString(matrix: Tensor, $: ExtensionEnv): string {
        return to_infix_string(matrix, $);
    }
    toLatexString(matrix: Tensor, $: ExtensionEnv): string {
        return to_infix_string(matrix, $);
    }
    toListString(matrix: Tensor, $: ExtensionEnv): string {
        return to_infix_string(matrix, $);
    }
    transform(expr: U): [TFLAGS, U] {
        const $ = this.$;
        // console.lg(`TensorExtension.transform ${print_expr(expr, $)}`);
        if (this.isKind(expr)) {
            const new_elements = expr.mapElements(function (element) {
                return $.valueOf(element);
            });
            // TODO: We should only create a new expression if the elements have changed.
            // To do this...
            // 1. zip the old and new elements together.
            // 2. Determine if there have been changes.
            // 3. Possibly construct a new matrix.
            const retval = expr.withElements(new_elements);
            const changed = !retval.equals(expr);
            return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
        }
        return [TFLAG_NONE, expr];
    }
    valueOf(expr: Tensor, $: ExtensionEnv): U {
        // const old_elements = expr.copyElements();
        const new_elements = expr.mapElements(function (element) {
            return $.valueOf(element);
        });
        // TODO: We should only create a new expression if the elements have changed.
        // To do this...
        // 1. zip the ols and new elements together.
        // 2. Determine if there have been changes.
        // 3. Possibly construct a new matrix.
        return expr.withElements(new_elements);
    }
}

export const tensor_extension = new ExtensionOperatorBuilder(function ($: ExtensionEnv) {
    return new TensorExtension($);
});