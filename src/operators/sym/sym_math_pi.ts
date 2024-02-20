import { is_blade, is_err, is_flt, is_imu, is_sym, is_tensor, is_uom, one, Sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { cons, Cons, is_atom, items_to_cons, U } from "math-expression-tree";
import { Extension, FEATURE, mkbuilder, TFLAGS, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { multiply } from "../../helpers/multiply";
import { order_binary } from "../../helpers/order_binary";
import { ProgrammingError } from "../../programming/ProgrammingError";
import { MATH_PI } from "../../runtime/ns_math";
import { create_flt } from "../../tree/flt/Flt";
import { is_hyp } from "../hyp/is_hyp";
import { is_pi } from "../pi/is_pi";
import { is_rat } from "../rat/rat_extension";
import { assert_sym } from "./assert_sym";

const ISZERO = native_sym(Native.iszero);
const MUL = native_sym(Native.multiply);
const POW = native_sym(Native.pow);

/**
 * 
 */
class SymMathPi implements Extension<Sym> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor() {
    }
    phases?: number | undefined;
    dependencies?: FEATURE[] | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binL(lhs: Sym, opr: Sym, rhs: U, env: ExprContext): U {
        if (opr.equalsSym(MUL)) {
            if (is_atom(rhs)) {
                if (is_blade(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_err(rhs)) {
                    return rhs;
                }
                else if (is_flt(rhs)) {
                    return create_flt(Math.PI * rhs.toNumber());
                }
                else if (is_hyp(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_imu(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_rat(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_sym(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_tensor(rhs)) {
                    return rhs.map(x => multiply(env, lhs, x));
                }
                else if (is_uom(rhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
            }
        }
        else if (opr.equalsSym(POW)) {
            if (is_atom(rhs)) {
                if (is_rat(rhs)) {
                    if (rhs.isZero()) {
                        return one;
                    }
                    else if (rhs.isOne()) {
                        return lhs;
                    }
                    else {
                        return items_to_cons(POW, lhs, rhs);
                    }
                }
            }
        }
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    binR(rhs: Sym, opr: Sym, lhs: U, env: ExprContext): U {
        if (opr.equalsSym(MUL)) {
            if (is_atom(lhs)) {
                if (is_hyp(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
                else if (is_tensor(lhs)) {
                    return lhs.map(x => multiply(env, x, rhs));
                }
                else if (is_uom(lhs)) {
                    return order_binary(MUL, lhs, rhs, env);
                }
            }
        }
        throw new ProgrammingError(` ${lhs} ${opr} ${rhs}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(expr: Sym, opr: Sym, argList: Cons, env: ExprContext): U {
        throw new Error("Method not implemented.");
    }
    test(expr: Sym, opr: Sym): boolean {
        if (opr.equalsSym(ISZERO)) {
            return false;
        }
        throw new Error(`SymMathPi.test ${opr} Method not implemented.`);
    }
    iscons(): false {
        return false;
    }
    operator(): Sym {
        throw new Error();
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return 'SymMathPi';
    }
    evaluate(expr: U, argList: Cons): [TFLAGS, U] {
        return this.transform(cons(expr, argList));
    }
    transform(expr: U): [TFLAGS, U] {
        return [this.isKind(expr) ? TFLAG_HALT : TFLAG_NONE, expr];
    }
    isKind(expr: U): expr is Sym {
        return is_pi(expr);
    }
    subst(expr: Sym, oldExpr: U, newExpr: U): U {
        if (expr.equals(oldExpr)) {
            return newExpr;
        }
        else {
            return expr;
        }
    }
    toHumanString(expr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(MATH_PI);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toInfixString(expr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(MATH_PI);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toLatexString(expr: Sym): string {
        // console.lg(`SymMathPi.toLatexString ${expr}`);
        return '\\pi';
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    toListString(expr: Sym, $: ExprContext): string {
        return $.getSymbolPrintName(MATH_PI);
    }
    valueOf(expr: Sym): Sym {
        return assert_sym(this.transform(expr)[1]);
    }
}

export const sym_math_pi_builder = mkbuilder(SymMathPi);
