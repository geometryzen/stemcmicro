import { create_int, create_sym, is_hyp, is_tensor, is_uom, QQ, Sym, Uom } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, items_to_cons, nil, U } from "math-expression-tree";
import { diagnostic, Diagnostics } from "../../diagnostics/diagnostics";
import { Extension, ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_UOM } from "../../hashing/hash_info";
import { multiply } from "../../helpers/multiply";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { two } from "../../tree/rat/Rat";
import { is_rat } from "../rat/rat_extension";

const ABS = native_sym(Native.abs);
const ADD = native_sym(Native.add);
const MUL = native_sym(Native.multiply);
const POW = native_sym(Native.pow);
const SIMPLIFY = native_sym(Native.simplify);

class UomExtension implements Extension<Uom> {
    constructor() {
        // Nothing to see here.
    }
    phases?: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    test(uom: Uom, opr: Sym, env: ExprContext): boolean {
        return false;
    }
    binL(lhs: Uom, opr: Sym, rhs: U, env: ExprContext): U {
        if (opr.equalsSym(ADD)) {
            if (is_atom(rhs)) {
                if (is_uom(rhs)) {
                    if (lhs.equals(rhs)) {
                        const expr = items_to_cons(MUL, two, lhs);
                        try {
                            return env.valueOf(expr);
                        }
                        finally {
                            expr.release();
                        }
                    }
                }
            }
        }
        else if (opr.equalsSym(MUL)) {
            if (is_atom(rhs)) {
                if (is_hyp(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_tensor(rhs)) {
                    return rhs.map(x => multiply(env, lhs, x));
                }
                else if (is_uom(rhs)) {
                    return lhs.mul(rhs);
                }
            }
        }
        else if (opr.equalsSym(POW)) {
            if (is_atom(rhs)) {
                if (is_rat(rhs)) {
                    const numer = rhs.numer();
                    const denom = rhs.denom();
                    const expo = QQ.valueOf(numer.toNumber(), denom.toNumber());
                    return lhs.pow(expo);
                }
            }
        }
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(atom: Uom, opr: Sym, lhs: U, expr: ExprContext): U {
        return nil;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(target: Uom, opr: Sym, argList: Cons, env: ExprContext): U {
        if (opr.equalsSym(ABS)) {
            return target;
        }
        else if (opr.equalsSym(SIMPLIFY)) {
            return target;
        }
        return diagnostic(Diagnostics.Poperty_0_does_not_exist_on_type_1, opr, create_sym(target.type));
    }
    iscons(): false {
        return false;
    }
    operator(): never {
        throw new ProgrammingError();
    }
    get hash(): string {
        return HASH_UOM;
    }
    get name(): string {
        return 'UomExtension';
    }
    get dependencies(): FEATURE[] {
        return ['Uom'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    valueOf(expr: Uom, $: ExtensionEnv): U {
        throw new Error('Method not implemented.');
    }
    isKind(arg: U): arg is Uom {
        return is_uom(arg);
    }
    subst(uom: Uom, oldExpr: U, newExpr: U): U {
        if (is_uom(oldExpr)) {
            if (uom.equals(oldExpr)) {
                return newExpr;
            }
        }
        return uom;
    }
    toHumanString(uom: Uom): string {
        return uom.toInfixString();
    }
    toInfixString(uom: Uom): string {
        if (uom.isOne()) {
            return "1";
        }
        else {
            return uom.toInfixString();
        }
    }
    toLatexString(uom: Uom): string {
        return uom.toInfixString();
    }
    toListString(uom: Uom): string {
        return uom.toString(10, false);
    }
    toString(): string {
        return this.name;
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        if (is_uom(expr)) {
            if (expr.isOne()) {
                return [TFLAG_DIFF, create_int(1)];
            }
            else {
                return [TFLAG_HALT, expr];
            }
        }
        return [TFLAG_NONE, expr];
    }
}

export const uom_extension_builder = mkbuilder(UomExtension);
