import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "@stemcmicro/hashing";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

type LHS = Rat;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

function eval_mul_2_rat_rat(expr: EXP): Rat {
    const lhs: Rat = expr.lhs;
    const rhs: Rat = expr.rhs;
    try {
        return mul_2_rat_rat(lhs, rhs);
    } finally {
        lhs.release();
        rhs.release();
    }
}

function mul_2_rat_rat(lhs: Rat, rhs: Rat): Rat {
    return lhs.mul(rhs);
}

class Op extends Function2<Rat, Rat> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_rat_rat", MATH_MUL, is_rat, is_rat);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: EXP): U {
        return eval_mul_2_rat_rat(expr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Rat, rhs: Rat, orig: EXP): [TFLAGS, U] {
        const retval = mul_2_rat_rat(lhs, rhs);
        // The result can't possible be the same as the original expression.
        return [TFLAG_DIFF, retval];
    }
}

export const mul_2_rat_rat_builder = mkbuilder<EXP>(Op);
