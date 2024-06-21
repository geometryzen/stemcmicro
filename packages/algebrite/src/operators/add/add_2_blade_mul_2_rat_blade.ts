import { Blade, is_blade, Rat, zero } from "@stemcmicro/atoms";
import { compare_blade_blade } from "@stemcmicro/helpers";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, SIGN_EQ, SIGN_GT, TFLAGS, TFLAG_DIFF, TFLAG_HALT, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_atom_cons, HASH_BLADE } from "@stemcmicro/hashing";
import { MATH_ADD, MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_mul_2_rat_blade } from "../mul/is_mul_2_rat_blade";

type LHS = Blade;
type RL = Rat;
type RR = Blade;
type RHS = Cons2<Sym, RL, RR>;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(private readonly config: EnvConfig) {
        super("add_2_blade_mul_2_rat_blade", MATH_ADD, is_blade, and(is_cons, is_mul_2_rat_blade));
        this.#hash = hash_binop_atom_cons(MATH_ADD, HASH_BLADE, MATH_MUL);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        // console.lg(this.name, decodeMode($.getMode()), render_as_infix(expr, $));
        if (this.config.noOptimize) {
            return [TFLAG_NONE, expr];
        }
        if ($.isExpanding()) {
            switch (compare_blade_blade(lhs, rhs.rhs)) {
                case SIGN_GT: {
                    return [TFLAG_DIFF, items_to_cons(opr, rhs, lhs)];
                }
                case SIGN_EQ: {
                    const sum = rhs.lhs.succ();
                    if (sum.isZero()) {
                        return [TFLAG_DIFF, zero];
                    }
                    if (sum.isOne()) {
                        return [TFLAG_DIFF, lhs];
                    }
                    return [TFLAG_DIFF, items_to_cons(rhs.opr, sum, lhs)];
                }
                default: {
                    return [TFLAG_HALT, expr];
                }
            }
        } else {
            return [TFLAG_NONE, expr];
        }
    }
}

export const add_2_blade_mul_2_rat_blade = mkbuilder(Op);
