import { Sym } from "math-expression-atoms";
import { Cons, is_cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../hashing/hash_info";
import { Function1 } from "./helpers/Function1";
import { Cons1 } from "./helpers/Cons1";

export abstract class CompositeOperator extends Function1<Cons> {
    readonly #hash: string;
    constructor(outerOpr: Sym, private readonly innerOpr: Sym, $: ExtensionEnv) {
        super(`${outerOpr}∘${innerOpr}`, outerOpr, is_cons, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U): expr is Cons1<Sym, Cons> {
        if (super.isKind(expr)) {
            const innerExpr = expr.arg;
            if (is_cons(innerExpr)) {
                return innerExpr.opr.equals(this.innerOpr);
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
}
