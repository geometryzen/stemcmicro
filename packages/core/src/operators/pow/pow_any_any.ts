import { Sym } from "@stemcmicro/atoms";
import { U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { power_base_expo } from "./power_base_expo";

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("pow_2_any_any", MATH_POW, is_any, is_any);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, base: LHS, expo: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        if ($.isExpanding()) {
            const newExpr = power_base_expo(base, expo, $);
            return [!newExpr.equals(expr) ? TFLAG_DIFF : TFLAG_NONE, newExpr];
        } else if ($.isFactoring()) {
            return [TFLAG_NONE, expr];
        } else {
            throw new Error();
        }
    }
}

/**
 * This is currently dead code.
 */
export const pow_2_any_any = mkbuilder(Op);
