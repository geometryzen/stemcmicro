import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Flt } from "../../tree/flt/Flt";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { is_flt } from "../flt/is_flt";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = Flt;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_flt_any", MATH_MUL, is_flt, is_any);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_FLT, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const lhs = expr.lhs;
            return lhs.isZero();
        } else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        // console.lg(this.name, render_as_infix(lhs, this.$), render_as_infix(rhs, this.$), render_as_infix(orig, this.$));
        if (lhs.isZero()) {
            return [TFLAG_DIFF, lhs];
        } else {
            return [TFLAG_NONE, orig];
        }
    }
}

export const mul_2_flt_any = mkbuilder<EXP>(Op);
