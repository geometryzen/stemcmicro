import { is_rat, one, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_cons, U } from "math-expression-tree";
import { Directive, ExtensionEnv, MODE_EXPANDING, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { hash_binop_cons_atom, HASH_RAT } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { negOne, Rat } from "../../tree/rat/Rat";
import { add } from "../add/add";
import { and } from "../helpers/and";
import { Cons1 } from "../helpers/Cons1";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { multiply } from "../mul/multiply";
import { sin } from "../sin/sin";
import { is_cos } from "./is_cos";
import { is_two } from "./is_two";
import { pow } from "./pow";

class Builder implements OperatorBuilder<Cons> {
    create($: ExtensionEnv): Operator<Cons> {
        return new Op($);
    }
}

type LL = U;
type LHS = Cons1<Sym, LL>;
type RHS = Rat;
type EXP = Cons2<Sym, LHS, RHS>;

const guardBase = and(is_cons, is_cos);
const guardExpo = and(is_rat, is_two);

class Op extends Function2<LHS, RHS> implements Operator<EXP> {
    readonly phases = MODE_EXPANDING;
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('cos_squared', MATH_POW, guardBase, guardExpo, $);
        this.#hash = hash_binop_cons_atom(MATH_POW, native_sym(Native.cos), HASH_RAT);
        // console.lg(this.name, "hash", this.#hash);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, cosX: LHS, two: RHS, orig: EXP): [TFLAGS, U] {
        const $ = this.$;
        if ($.getDirective(Directive.convertSinToCos)) {
            return [TFLAG_NONE, orig];
        }
        else {
            const X = cosX.arg;
            const retval = add(one, multiply(negOne, pow(sin(X), two)));
            return [TFLAG_DIFF, $.valueOf(retval)];
        }
    }
}

// Dead code.
// There is a more general conversion of cos^2n and sin^2n in power evaluation.
export const cos_squared_expanding = new Builder();
