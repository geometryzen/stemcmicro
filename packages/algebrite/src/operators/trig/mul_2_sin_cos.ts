import { hash_binop_cons_cons } from "@stemcmicro/hashing";
import { Cons2 } from "@stemcmicro/tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { items_to_cons } from "../../makeList";
import { MATH_MUL } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, U } from "../../tree/tree";
import { MATH_COS } from "../cos/MATH_COS";
import { and } from "../helpers/and";
import { Cons1 } from "../helpers/Cons1";
import { Function2 } from "../helpers/Function2";
import { is_opr_1_any } from "../helpers/is_opr_1_any";
import { MATH_SIN } from "../sin/MATH_SIN";

export class Builder implements ExtensionBuilder<Cons> {
    constructor(
        public readonly name: string,
        public readonly opr: Sym,
        public readonly lhs: Sym,
        public readonly rhs: Sym
    ) {
        // Nothing to see here.
    }
    create(config: Readonly<EnvConfig>): Extension<Cons> {
        return new Op(this.name, this.opr, this.lhs, this.rhs, config);
    }
}

type LHS = Cons1<Sym, U>;
type RHS = Cons1<Sym, U>;
type EXP = Cons2<Sym, LHS, RHS>;

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(
        name: string,
        opr: Sym,
        lhs: Sym,
        rhs: Sym,
        readonly config: Readonly<EnvConfig>
    ) {
        super(name, opr, and(is_cons, is_opr_1_any(lhs)), and(is_cons, is_opr_1_any(rhs)));
        this.#hash = hash_binop_cons_cons(opr, lhs, rhs);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, orig: EXP, $: ExtensionEnv): [TFLAGS, U] {
        return [TFLAG_DIFF, $.valueOf(items_to_cons(opr, orig.rhs, orig.lhs))];
    }
}

export const mul_2_sin_cos = new Builder("mul_2_sin_cos", MATH_MUL, MATH_SIN, MATH_COS);
