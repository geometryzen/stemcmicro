import { diffFlag, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { BCons } from "./BCons";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";

export abstract class Function2<L extends U, R extends U> extends FunctionVarArgs {
    constructor(name: string, opr: Sym, private readonly guardL: GUARD<U, L>, private readonly guardR: GUARD<U, R>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    isKind(expr: U): boolean {
        const m = this.match(expr);
        return !!m;
    }
    match(expr: U): BCons<Sym, L, R> | undefined {
        try {
            if (is_cons(expr) && expr.length === 3) {
                const opr = expr.opr;
                const lhs = expr.item(1);
                const rhs = expr.item(2);
                if (is_sym(opr)) {
                    if (this.opr.equalsSym(opr)) {
                        if (this.guardL(lhs)) {
                            if (this.guardR(rhs)) {
                                return expr as BCons<Sym, L, R>;
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
     * 
     * @param opr The operator symbol typed according to the matches that have been made.
     * @param lhs The left hand side typed according to the matches that have been made.
     * @param rhs The right hand side typed according to the matches that have been made.
     * @param expr The original expression typed according to the matches that have been made.
     */
    abstract transform2(opr: Sym, lhs: L, rhs: R, expr: BCons<Sym, L, R>): [TFLAGS, U];
}