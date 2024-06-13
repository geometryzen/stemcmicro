import { Rat, zero } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_SYM } from "../../hashing/hash_info";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_mul_2_rat_sym } from "../mul/is_mul_2_rat_sym";
import { is_sym } from "../sym/is_sym";

type LHS = Sym;
type RHS = Cons2<Sym, Rat, Sym>;
type EXP = Cons2<Sym, LHS, RHS>;

function cross(lhs: LHS, rhs: RHS): boolean {
    return rhs.lhs.isMinusOne() && lhs.equalsSym(rhs.rhs);
}

/**
 * x + (-1 * x) => 0, where
 */
class Op extends Function2X<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("add_2_xxx_mul_2_rm1_xxx", MATH_ADD, is_sym, and(is_cons, is_mul_2_rat_sym), cross);
        this.#hash = hash_binop_atom_cons(MATH_ADD, HASH_SYM, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP): [TFLAGS, U] {
        return [TFLAG_DIFF, zero];
    }
}

/**
 * x + (-1 * x) => 0, where x is a Sym and -1 is a Rat.
 */
export const add_2_xxx_mul_2_rm1_xxx = mkbuilder(Op);
