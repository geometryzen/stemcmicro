import { is_err, is_rat, Rat, Sym, zero } from "@stemcmicro/atoms";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons2, U } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_any_rat", native_sym(Native.multiply), is_any, is_rat);
        this.#hash = hash_binop_atom_atom(native_sym(Native.multiply), HASH_ANY, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const rhs = expr.rhs;
            return rhs.isZero() || rhs.isOne();
        } else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        if (is_err(lhs)) {
            return [TFLAG_DIFF, lhs];
        } else if (rhs.isOne()) {
            return [TFLAG_DIFF, lhs];
        } else if (rhs.isZero()) {
            return [TFLAG_DIFF, zero];
        } else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_any_rat = mkbuilder(Op);
