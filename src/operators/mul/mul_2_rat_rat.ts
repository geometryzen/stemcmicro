
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_MUL } from "../../runtime/ns_math";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_rat } from "../rat/is_rat";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

class Op extends Function2<Rat, Rat> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('mul_2_rat_rat', MATH_MUL, is_rat, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_MUL, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform2(opr: Sym, lhs: Rat, rhs: Rat, orig: U): [TFLAGS, U] {
        // console.lg(this.name, render_as_infix(lhs, this.$), render_as_infix(rhs, this.$), render_as_infix(orig, this.$));
        return [TFLAG_DIFF, lhs.mul(rhs)];
    }
}

export const mul_2_rat_rat = new Builder();
