import { is_tensor, Sym, Tensor } from "math-expression-atoms";
import { AtomHandler, ExprContext } from "math-expression-context";
import { cons, Cons, nil, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_TENSOR } from "../../hashing/hash_info";
import { print_tensor } from "../../print/print";
import { to_infix_string } from "../../print/to_infix_string";
import { MAXDIM } from "../../runtime/constants";
import { defs, PrintMode, PRINTMODE_SEXPR } from "../../runtime/defs";
import { simplify } from "../simplify/simplify";
import { subst } from "../subst/subst";

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

export function equal_tensor_tensor(p1: Tensor, p2: Tensor, $: ExtensionEnv): boolean {
    if (p1.ndim < p2.ndim) {
        return false;
    }

    if (p1.ndim > p2.ndim) {
        return false;
    }

    for (let i = 0; i < p1.ndim; i++) {
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
    const ndim = lhs.ndim + rhs.ndim;
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

class TensorExtension implements Extension<Tensor>, AtomHandler<Tensor>{
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(atom: Tensor, opr: Sym, env: ExprContext): boolean {
        throw new Error(`${this.name}.dispatch(${atom},${opr}) method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get hash(): string {
        return HASH_TENSOR;
    }
    get name(): string {
        return 'TensorExtension';
    }
    isKind(arg: U): arg is Tensor {
        return is_tensor(arg);
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
        const printMode: PrintMode = defs.printMode;
        defs.setPrintMode(PRINTMODE_SEXPR);
        try {
            return print_tensor(matrix, $);
        }
        finally {
            defs.setPrintMode(printMode);
        }
    }
    evaluate(matrix: Tensor, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return this.transform(cons(matrix, argList), $);
    }
    simplify(M: Tensor, $: ExtensionEnv) {
        return M.map(
            function (x) {
                return simplify(x, $);
            }
        );
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
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

export const tensor_extension = new TensorExtension();

export const tensor_extension_builder = mkbuilder(TensorExtension);
