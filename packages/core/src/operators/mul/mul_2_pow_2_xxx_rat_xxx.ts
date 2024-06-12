import { Rat } from "@stemcmicro/atoms";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_SYM } from "../../hashing/hash_info";
import { items_to_cons } from "../../makeList";
import { MATH_MUL, MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2X } from "../helpers/Function2X";
import { is_pow_2_sym_rat } from "../pow/is_pow_2_sym_rat";
import { is_sym } from "../sym/is_sym";

function cross(lhs: Cons2<Sym, Sym, Rat>, rhs: Sym): boolean {
    const s1 = lhs.lhs;
    const s2 = rhs;
    return s1.equalsSym(s2);
}

/**
 * (xxx ** Rat) * xxx => xxx ** (succ(Rat))
 */
class Op extends Function2X<Cons2<Sym, Sym, Rat>, Sym> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("mul_2_pow_2_xxx_rat_xxx", MATH_MUL, and(is_cons, is_pow_2_sym_rat), is_sym, cross);
        this.#hash = hash_binop_cons_atom(MATH_MUL, MATH_POW, HASH_SYM);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Cons2<Sym, Sym, Rat>, rhs: Sym, expr: Cons2<Sym, Cons2<Sym, Sym, Rat>, Sym>, $: ExtensionEnv): [TFLAGS, U] {
        const xxx = lhs.lhs;
        const rat = lhs.rhs;
        const expo = rat.succ();
        const D = $.valueOf(items_to_cons(MATH_POW, xxx, expo));
        return [TFLAG_DIFF, D];
    }
}

export const mul_2_pow_2_xxx_rat_xxx = mkbuilder(Op);
