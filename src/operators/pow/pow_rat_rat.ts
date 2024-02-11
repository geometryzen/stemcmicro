import { is_rat, Rat, Sym } from "math-expression-atoms";
import { Cons, Cons2, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_binop_atom_atom, HASH_RAT } from "../../hashing/hash_info";
import { power_rat_base_rat_expo } from "../../power_rat_base_rat_expo";
import { MATH_POW } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LHS = Rat;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('pow_rat_rat', MATH_POW, is_rat, is_rat, $);
        this.#hash = hash_binop_atom_atom(MATH_POW, HASH_RAT, HASH_RAT);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: Rat, rhs: Rat, expr: EXP): [TFLAGS, U] {
        // console.lg(this.name, `${lhs}`, `${rhs}`);
        // const $ = this.$;
        // console.lg(`${this.name}  ${print_expr(expr, $)}`);
        const retval = power_rat_base_rat_expo(lhs, rhs, this.$);
        return [retval.equals(expr) ? TFLAG_HALT : TFLAG_DIFF, retval];
    }
}

export const pow_rat_rat = new Builder();
