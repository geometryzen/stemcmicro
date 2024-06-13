import { one } from "@stemcmicro/atoms";
import { do_factorize_rhs } from "../../calculators/factorize/do_factorize_rhs";
import { is_factorize_rhs } from "../../calculators/factorize/is_factorize_rhs";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_ADD } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS, exp: EXP, $: ExtensionEnv): boolean {
    if ($.isFactoring()) {
        return is_factorize_rhs(lhs, rhs);
    } else {
        return false;
    }
}

class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_any_any_factorize_rhs", MATH_ADD, is_any, is_any, cross);
        this.#hash = hash_binop_atom_atom(MATH_ADD, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return do_factorize_rhs(lhs, rhs, one, expr, $);
    }
}

export const add_2_any_any_factorize_rhs = mkbuilder(Op);
