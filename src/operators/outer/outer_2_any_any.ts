
import { Sym } from "math-expression-atoms";
import { Cons, Cons2, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { is_multiply } from "../../runtime/helpers";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    constructor(private readonly opr: Sym) {
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(this.opr, $);
    }
}

type LHS = U;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> implements Operator<Cons> {
    readonly #hash: string;
    constructor(opr: Sym, $: ExtensionEnv) {
        super('outer_2_any_any', opr, is_any, is_any, $);
        this.#hash = hash_binop_atom_atom(this.opr, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U): expr is EXP {
        if (super.isKind(expr)) {
            const lhs = expr.lhs;
            const rhs = expr.rhs;
            if (is_multiply(lhs) || is_multiply(rhs)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP): [TFLAGS, U] {
        // console.lg(`${this.name}`);
        return [TFLAG_NONE, expr];
    }
}

export const outer_2_any_any = new Builder(MATH_OUTER);
