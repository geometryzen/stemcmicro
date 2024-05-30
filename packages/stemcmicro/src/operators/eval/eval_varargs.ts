import { ExprContext } from "@stemcmicro/context";
import { Cons, is_cons, U } from "@stemcmicro/tree";
import { ExtensionEnv, mkbuilder, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { EVAL } from "../../runtime/constants";
import { cddr } from "../../tree/helpers";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";
import { subst } from "../subst/subst";

/**
 * eval(f, x1, a1, x2, a2, ...)
 *
 * @returns f evaluated with x replaced by a, y replaced by b, etc.
 */
export function eval_eval(expr: Cons, $: Pick<ExprContext, "handlerFor" | "valueOf">): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        let rest = argList.rest;
        try {
            let F = $.valueOf(head);
            try {
                while (is_cons(rest)) {
                    const item0 = rest.item0;
                    const item1 = rest.item1;
                    try {
                        const x = $.valueOf(item0);
                        const a = $.valueOf(item1);
                        try {
                            F = subst(F, x, a, $);
                            rest = cddr(rest);
                        } finally {
                            x.release();
                            a.release();
                        }
                    } finally {
                        item0.release();
                        item1.release();
                    }
                }
                return $.valueOf(F);
            } finally {
                F.release();
            }
        } finally {
            head.release();
            rest.release();
        }
    } finally {
        argList.release();
    }
}

class Op extends FunctionVarArgs<Cons> {
    readonly #hash: string;
    constructor() {
        super("eval", EVAL);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    transform(expr: Cons, $: ExtensionEnv): [number, U] {
        const retval = eval_eval(expr, $);
        return [TFLAG_DIFF, retval];
    }
}

export const eval_varargs = mkbuilder(Op);
