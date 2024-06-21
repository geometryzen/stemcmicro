import { create_str, create_sym, is_tensor, is_uom, Sym, Tensor } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { diagnostic, Diagnostics } from "@stemcmicro/diagnostics";
import { Directive } from "@stemcmicro/directive";
import { conjfunc, inner, power, push_rational } from "@stemcmicro/eigenmath";
import { HASH_TENSOR } from "@stemcmicro/hashing";
import { isone, iszero, multiply, subst } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { StackU } from "@stemcmicro/stack";
import { cons, Cons, is_atom, items_to_cons, nil, U } from "@stemcmicro/tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { simplify } from "../../helpers/simplify";
import { PrintConfig, print_str, render_using_non_sexpr_print_mode } from "../../print/print";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { MAXDIM } from "../../runtime/constants";
import { PrintMode } from "../../runtime/defs";
import { assert_square_matrix_tensor, is_line_matrix, is_square_matrix } from "../../tensor";
import { cofactor } from "../cofactor/cofactor";
import { is_hyp } from "../hyp/is_hyp";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const ISONE = native_sym(Native.isone);
const MUL = native_sym(Native.multiply);

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

function add(lhs: U, rhs: U, env: ExprContext): U {
    const expr = items_to_cons(ADD, lhs, rhs);
    try {
        return env.valueOf(expr);
    } finally {
        expr.release();
    }
}

export function add_tensor_tensor(A: Tensor, B: Tensor, env: ExprContext): Cons | Tensor {
    if (!A.sameDimensions(B)) {
        return nil;
    }
    return A.map(function (a, i) {
        return add(a, B.elem(i), env);
    });
}

export function outer_tensor_tensor(lhs: Tensor, rhs: Tensor, $: ExtensionEnv): Tensor {
    const ndim = lhs.ndim + rhs.ndim;
    if (ndim > MAXDIM) {
        throw new Error("outer: rank of result exceeds maximum");
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
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(m: Tensor, opr: Sym, env: ExprContext): boolean {
        if (opr.equalsSym(ISONE)) {
            if (is_line_matrix(m)) {
                const n = m.dim(0);
                for (let i = 0; i < n; i++) {
                    const element = m.elem(n * i);
                    if (i === 0) {
                        if (!isone(element, env)) {
                            return false;
                        }
                    } else {
                        if (!iszero(element, env)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            if (is_square_matrix(m)) {
                const n = m.dim(0);
                for (let i = 0; i < n; i++) {
                    for (let j = 0; j < n; j++) {
                        const element = m.elem(n * i + j);
                        if (i === j) {
                            if (!isone(element, env)) {
                                return false;
                            }
                        } else {
                            if (!iszero(element, env)) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        }
        throw new Error(`${this.name}.test(${m},${opr}) method not implemented.`);
    }
    binL(lhs: Tensor, opr: Sym, rhs: U, env: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                if (is_tensor(rhs)) {
                    return add_tensor_tensor(lhs, rhs, env);
                }
            }
        } else if (opr.equalsSym(MUL)) {
            if (is_atom(rhs)) {
                if (is_hyp(rhs)) {
                    return lhs.map((x) => multiply(env, x, rhs));
                } else if (is_uom(rhs)) {
                    return lhs.map((x) => multiply(env, x, rhs));
                }
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(atom: Tensor, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    dispatch(target: Tensor, opr: Sym, argList: Cons, env: ExprContext): U {
        switch (opr.id) {
            case Native.abs: {
                // Using the Eigenmath implementation right now as it is a bit simpler than abs_of_tensor.
                const $ = new StackU();
                if (target.ndim > 1) {
                    $.push(ABS);
                    $.push(target);
                    $.list(2);
                    return $.pop();
                }
                $.push(target); //          [x]
                $.push(target); //          [x, x]
                conjfunc(env, $); //   [x, conj(x)]
                inner(env, $); //      [x | conj(x)]
                push_rational(1, 2, $); //  [x | conj(x), 1/2]
                power(env, $); //      [sqrt(x | conj(x))]
                return $.pop();
            }
            case Native.adj: {
                return adj(target, env);
            }
            case Native.human: {
                return create_str(this.toHumanString(target, env));
            }
            case Native.infix: {
                return create_str(this.toInfixString(target, env));
            }
            case Native.latex: {
                return create_str(this.toLatexString(target, env));
            }
            case Native.sexpr: {
                return create_str(this.toListString(target, env));
            }
            case Native.simplify: {
                return target.map((x) => simplify(x, env));
            }
        }
        return diagnostic(Diagnostics.Property_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    get hash(): string {
        return HASH_TENSOR;
    }
    get name(): string {
        return "TensorExtension";
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
        } else {
            return expr.withElements(elems);
        }
    }
    toHumanString(matrix: Tensor, $: ExprContext): string {
        $.pushDirective(Directive.printMode, PrintMode.Human);
        try {
            return print_tensor(matrix, $);
        } finally {
            $.popDirective();
        }
    }
    toInfixString(matrix: Tensor, $: ExprContext): string {
        $.pushDirective(Directive.printMode, PrintMode.Infix);
        try {
            return print_tensor(matrix, $);
        } finally {
            $.popDirective();
        }
    }
    toLatexString(matrix: Tensor, $: ExprContext): string {
        return print_tensor_latex(matrix, $);
    }
    toListString(matrix: Tensor, $: ExprContext): string {
        $.pushDirective(Directive.printMode, PrintMode.SExpr);
        try {
            return print_tensor(matrix, $);
        } finally {
            $.popDirective();
        }
    }
    evaluate(matrix: Tensor, argList: Cons, $: ExtensionEnv): [TFLAGS, U] {
        return this.transform(cons(matrix, argList), $);
    }
    simplify(M: Tensor, $: ExtensionEnv) {
        return M.map(function (x) {
            return simplify(x, $);
        });
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

export function print_tensor(p: Tensor<U>, $: PrintConfig): string {
    return print_tensor_inner(p, 0, 0, $)[1];
}

/**
 *
 * @param p
 * @param j scans the dimensions
 * @param k is an increment for all the printed elements
 * @param $
 * @returns
 */
function print_tensor_inner(p: Tensor<U>, j: number, k: number, $: PrintConfig): [number, string] {
    let accumulator = "";

    const useParenForTensors = $.getDirective(Directive.useParenForTensors);

    if (useParenForTensors) {
        accumulator += print_str("(");
    } else {
        accumulator += print_str("[");
    }

    // only the last dimension prints the actual elements
    // e.g. in a matrix, the first dimension contains
    // vectors, not elements, and the second dimension
    // actually contains the elements

    // if not the last dimension, we are just printing wrappers
    // and recursing down i.e. we print the next dimension
    if (j < p.ndim - 1) {
        for (let i = 0; i < p.dim(j); i++) {
            let retString: string;
            [k, retString] = Array.from(print_tensor_inner(p, j + 1, k, $)) as [number, string];
            accumulator += retString;
            // add separator between elements dimensions
            // "above" the inner-most dimension
            if (i !== p.dim(j) - 1) {
                if ($.getDirective(Directive.printMode) === PrintMode.SExpr) {
                    accumulator += print_str(" ");
                } else {
                    accumulator += print_str(",");
                }
            }
        }
        // if we reached the last dimension, we print the actual
        // elements
    } else {
        for (let i = 0; i < p.dim(j); i++) {
            accumulator += render_using_non_sexpr_print_mode(p.elem(k), $);
            // add separator between elements in the
            // inner-most dimension
            if (i !== p.dim(j) - 1) {
                if ($.getDirective(Directive.printMode) === PrintMode.SExpr) {
                    accumulator += print_str(" ");
                } else {
                    accumulator += print_str(",");
                }
            }
            k++;
        }
    }

    if (useParenForTensors) {
        accumulator += print_str(")");
    } else {
        accumulator += print_str("]");
    }
    return [k, accumulator];
}

function print_tensor_latex(p: Tensor<U>, $: PrintConfig): string {
    if (p.ndim <= 2) {
        return print_tensor_inner_latex(true, p, 0, 0, $)[1];
    } else {
        return "";
    }
}

// firstLevel is needed because printing a matrix
// is not exactly an elegant recursive procedure:
// the vector on the first level prints the latex
// "wrap", while the vectors that make up the
// rows don't. so it's a bit asymmetric and this
// flag helps.
// j scans the dimensions
// k is an increment for all the printed elements
//   since they are all together in sequence in one array
function print_tensor_inner_latex(firstLevel: boolean, p: Tensor<U>, j: number, k: number, $: PrintConfig): [number, string] {
    let accumulator = "";

    // open the outer latex wrap
    if (firstLevel) {
        accumulator += "\\begin{bmatrix} ";
    }

    // only the last dimension prints the actual elements
    // e.g. in a matrix, the first dimension contains
    // vectors, not elements, and the second dimension
    // actually contains the elements

    // if not the last dimension, we are just printing wrappers
    // and recursing down i.e. we print the next dimension
    if (j < p.ndim - 1) {
        for (let i = 0; i < p.dim(j); i++) {
            let retString: string;
            [k, retString] = Array.from(print_tensor_inner_latex(false, p, j + 1, k, $)) as [number, string];
            accumulator += retString;
            if (i !== p.dim(j) - 1) {
                // add separator between rows
                accumulator += print_str(" \\\\ ");
            }
        }
        // if we reached the last dimension, we print the actual
        // elements
    } else {
        for (let i = 0; i < p.dim(j); i++) {
            accumulator += render_using_non_sexpr_print_mode(p.elem(k), $);
            // separator between elements in each row
            if (i !== p.dim(j) - 1) {
                accumulator += print_str(" & ");
            }
            k++;
        }
    }

    // close the outer latex wrap
    if (firstLevel) {
        accumulator += " \\end{bmatrix}";
    }

    return [k, accumulator];
}

export function adj(m: Tensor, $: Pick<ExprContext, "valueOf">): U {
    const n = assert_square_matrix_tensor(m);
    const elems = new Array<U>(m.nelem);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            elems[n * j + i] = cofactor(m, i, j, $);
        }
    }
    return m.withElements(elems);
}
