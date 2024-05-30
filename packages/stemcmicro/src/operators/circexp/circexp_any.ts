import { circexp } from "../../circexp";
import { EnvConfig } from "../../env/EnvConfig";
import { Directive, ExtensionEnv, mkbuilder, MODE_EXPANDING, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { CIRCEXP } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

type ARG = U;
type EXP = Cons1<Sym, ARG>;

class Op extends Function1<ARG> {
    readonly #hash: string;
    readonly phases = MODE_EXPANDING;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("circexp_any", CIRCEXP, is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: ARG, oldExpr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        $.pushDirective(Directive.convertTrigToExp, 1);
        try {
            const rawExpr = circexp(arg, $);
            const newExpr = $.valueOf(rawExpr);
            // console.lg(`oldExpr=${oldExpr}`);
            // console.lg(`rawExpr=${rawExpr}`);
            // console.lg(`newExpr=${newExpr}`);
            const changed = !newExpr.equals(oldExpr);
            return [changed ? TFLAG_DIFF : TFLAG_NONE, newExpr];
        } finally {
            $.popDirective();
        }
    }
}

export const circexp_any = mkbuilder(Op);
