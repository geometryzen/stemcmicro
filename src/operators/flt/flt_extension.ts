import { create_sym, Flt, is_boo, is_err, is_flt, is_rat, is_sym, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../../diagnostics/diagnostics";
import { Extension, FEATURE, mkbuilder, Sign, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { number_to_floating_point_string } from "../../runtime/number_to_floating_point_string";
import { create_flt, oneAsFlt } from "../../tree/flt/Flt";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const ISZERO = native_sym(Native.iszero);
const MUL = native_sym(Native.multiply);
const POW = native_sym(Native.pow);

export function compare_flts(lhs: Flt, rhs: Flt): Sign {
    if (lhs.d < rhs.d) {
        return -1;
    }
    if (lhs.d > rhs.d) {
        return 1;
    }
    return 0;
}

export class FltExtension implements Extension<Flt> {
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
        throw new Error(`${this.name}.test(${atom},${opr}) method not implemented.`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Flt, opr: Sym, rhs: U, env: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                if (is_boo(rhs)) {
                    return diagnostic(Diagnostics.Operator_0_cannot_be_applied_to_types_1_and_2, ADD, create_sym(lhs.type), create_sym(rhs.type));
                }
                else if (is_flt(rhs)) {
                    return lhs.add(rhs);
                }
                else if (is_rat(rhs)) {
                    return create_flt(lhs.toNumber() + rhs.toNumber());
                }
                else if (is_sym(rhs)) {
                    return order_binary(ADD, lhs, rhs, env);
                }
                else if (is_err(rhs)) {
                    return rhs;
                }
            }
        }
        else if (opr.equalsSym(MUL)) {
            if (is_atom(rhs)) {
                if (is_flt(rhs)) {
                    return lhs.mul(rhs);
                }
            }
        }
        else if (opr.equalsSym(POW)) {
            if (is_atom(rhs)) {
                if (is_rat(rhs)) {
                    if (rhs.isMinusOne()) {
                        return lhs.inv();
                    }
                }
            }
        }
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Flt, opr: Sym, lhs: U, expr: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(lhs)) {
                if (is_flt(lhs)) {
                    return lhs.add(rhs);
                }
                else if (is_rat(lhs)) {
                    return create_flt(lhs.toNumber() + rhs.toNumber());
                }
            }
        }
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Flt, opr: Sym, argList: Cons, env: ExprContext): U {
        if (opr.equalsSym(ABS)) {
            return target.abs();
        }
        throw new ProgrammingError(`FltExtension.dispatch ${target} ${opr} ${argList} method not implemented.`);
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
    toHumanString(atom: Flt, $: ExprContext): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toInfixString(atom: Flt, $: ExprContext): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toLatexString(atom: Flt, $: ExprContext): string {
        return number_to_floating_point_string(atom.d, $);
    }
    toListString(atom: Flt, $: ExprContext): string {
        return number_to_floating_point_string(atom.d, $);
    }
    valueOf(expr: Flt): U {
        return expr;
    }
}

export const flt_extension_builder = mkbuilder<Flt>(FltExtension);