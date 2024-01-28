import { diffFlag, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { Cons2 } from "./Cons2";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";

export abstract class Function2<L extends U, R extends U> extends FunctionVarArgs {
    constructor(name: string, opr: Sym, private readonly guardL: GUARD<U, L>, private readonly guardR: GUARD<U, R>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    isKind(expr: U): expr is Cons2<Sym, L, R> {
        const m = this.match(expr);
        return !!m;
    }
    match(expr: U): Cons2<Sym, L, R> | undefined {
        try {
            if (is_cons(expr) && expr.length === 3) {
                const opr = expr.opr;
                const lhs = expr.item(1);
                const rhs = expr.item(2);
                if (is_sym(opr)) {
                    if (this.opr.equalsSym(opr)) {
                        if (this.guardL(lhs)) {
                            if (this.guardR(rhs)) {
                                return expr as Cons2<Sym, L, R>;
                            }
                            else {
                                return void 0;
                            }
                        }
                        else {
                            return void 0;
                        }
                    }
                    else {
                        return void 0;
                    }
                }
                else {
                    return void 0;
                }
            }
            else {
                return void 0;
            }
        }
        catch (e) {
            throw new Error(`${this.name} + ${e}`);
        }
    }
    transform(expr: U): [TFLAGS, U] {
        const m = this.match(expr);
        if (m) {
            const $ = this.$;
            // FIXME: THis can throw an exception / return Err. So we should not really do it.
            const [flagsL, lhs] = $.transform(m.lhs);
            const [flagsR, rhs] = $.transform(m.rhs);
            /*
            if (changedL === lhs.equals(m.lhs)) {
                throw new Error(`changedL = ${changedL} newExpr=${lhs} oldExpr=${m.lhs}`);
            }
            if (changedR === rhs.equals(m.rhs)) {
                throw new Error(`changedR = ${changedR} newExpr=${rhs} oldExpr=${m.rhs}`);
            }
            */
            // console.lg(`${$.toInfixString(m.lhs)} becomes lhs=>${$.toInfixString(lhs)}, flagsL=${flagsL}`);
            // console.lg(`${$.toInfixString(m.rhs)} becomes rhs=>${$.toInfixString(rhs)}, flagsR=${flagsR}`);
            if (diffFlag(flagsL) || diffFlag(flagsR)) {
                return [TFLAG_DIFF, $.valueOf(items_to_cons(m.opr, lhs, rhs))];
            }
            else {
                return this.transform2(m.opr, m.lhs, m.rhs, m);
            }
        }
        return [TFLAG_NONE, expr];
    }
    /**
     * This abstract function is only called if there is no change in the lhs and rhs following evaluation.
     * @param opr The operator symbol typed according to the matches that have been made.
     * @param lhs The unevaluated left hand side typed according to the matches that have been made.
     * @param rhs The unevaluated right hand side typed according to the matches that have been made.
     * @param expr The original expression typed according to the matches that have been made.
     */
    abstract transform2(opr: Sym, lhs: L, rhs: R, expr: Cons2<Sym, L, R>): [TFLAGS, U];
}