import { Flt, is_flt, Sym } from "math-expression-atoms";
import { AtomHandler } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, U } from "math-expression-tree";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, Sign, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { number_to_floating_point_string } from "../../runtime/number_to_floating_point_string";
import { oneAsFlt } from "../../tree/flt/Flt";

const ISZERO = native_sym(Native.iszero);

export function compare_flts(lhs: Flt, rhs: Flt): Sign {
    if (lhs.d < rhs.d) {
        return -1;
    }
    if (lhs.d > rhs.d) {
        return 1;
    }
    return 0;
}

export class FltExtension implements Extension<Flt>, AtomHandler<Flt> {
    constructor() {
        // Nothing to see here.
    }
    get hash(): string {
        return oneAsFlt.name;
    }
    get name(): string {
        return 'FltExtension';
    }
    test(atom: Flt, opr: Sym): boolean {
        if (opr.equalsSym(ISZERO)) {
            return atom.isZero();
        }
        throw new Error(`${this.name}.dispatch(${atom},${opr}) method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new Error();
    }
    get dependencies(): FEATURE[] {
        return ['Flt'];
    }
    evaluate(atom: Flt, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(atom, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [expr instanceof Flt ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    isKind(arg: U): arg is Flt {
        return is_flt(arg);
    }
    subst(expr: Flt, oldExpr: U, newExpr: U): U {
        if (is_flt(oldExpr)) {
            if (expr.equals(oldExpr)) {
                return newExpr;
            }
        }
        return expr;
    }
    toInfixString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toLatexString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toListString(atom: Flt, $: ExtensionEnv): string {
        return number_to_floating_point_string(atom.d, $);
    }
    valueOf(expr: Flt): U {
        return expr;
    }
}

export const flt_extension_builder = mkbuilder<Flt>(FltExtension);