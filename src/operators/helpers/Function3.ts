import { Cons3 } from "math-expression-tree";
import { diffFlag, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { is_sym } from "../sym/is_sym";
import { FunctionVarArgs } from "./FunctionVarArgs";
import { GUARD } from "./GUARD";

export abstract class Function3<A extends U, B extends U, C extends U> extends FunctionVarArgs {
    constructor(name: string, opr: Sym, private readonly guardA: GUARD<U, A>, private readonly guardB: GUARD<U, B>, private readonly guardC: GUARD<U, C>, $: ExtensionEnv) {
        super(name, opr, $);
    }
    isKind(expr: U): expr is Cons3<Sym, A, B, C> {
        const m = this.match(expr);
        return !!m;
    }
    match(expr: U): Cons3<Sym, A, B, C> | undefined {
        try {
            if (is_cons(expr) && expr.length === 4) {
                const opr = expr.opr;
                const a = expr.item(1);
                const b = expr.item(2);
                const c = expr.item(3);
                try {
                    if (is_sym(opr)) {
                        if (this.opr.equalsSym(opr)) {
                            if (this.guardA(a)) {
                                if (this.guardB(b)) {
                                    if (this.guardC(c)) {
                                        return expr as Cons3<Sym, A, B, C>;
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
                finally {
                    opr.release();
                    a.release();
                    b.release();
                    c.release();
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
            // The match ensures that the cast is OK. We could double-check using an assert.
            const argA = m.item(1) as A;
            const argB = m.item(2) as B;
            const argC = m.item(3) as C;
            try {
                const $ = this.$;
                // FIXME: THis can throw an exception / return Err. So we should not really do it.
                const [flagsA, a] = $.transform(argA);
                const [flagsB, b] = $.transform(argB);
                const [flagsC, c] = $.transform(argC);
                try {
                    if (diffFlag(flagsA) || diffFlag(flagsB) || diffFlag(flagsC)) {
                        const x = items_to_cons(m.opr, a, b, c);
                        try {
                            return [TFLAG_DIFF, $.valueOf(x)];
                        }
                        finally {
                            x.release();
                        }
                    }
                    else {
                        return this.transform3(m.opr, argA, argB, argC, m);
                    }
                }
                finally {
                    a.release();
                    b.release();
                    c.release();
                }
            }
            finally {
                argA.release();
                argB.release();
                argC.release();
            }
        }
        return [TFLAG_NONE, expr];
    }
    abstract transform3(opr: Sym, a: A, b: B, c: C, expr: Cons3<Sym, A, B, C>): [TFLAGS, U];
}