import { is_opr_2_any_any } from "@stemcmicro/helpers";
import { Native, native_sym } from "@stemcmicro/native";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, mkbuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_cons_atom } from "../../hashing/hash_info";
import { MATH_POW } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";
import { dpower } from "./helpers/dpower";

type LHS = Cons2<Sym, U, U>;
type RHS = U;
type EXP = Cons2<Sym, LHS, RHS>;

/**
 * (derivative (pow base expo) X)
 */
class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    constructor(readonly config: Readonly<EnvConfig>) {
        super("derivative_2_pow_any", native_sym(Native.derivative), and(is_cons, is_opr_2_any_any(MATH_POW)), is_any);
        this.#hash = hash_binop_cons_atom(this.opr, MATH_POW, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS, expr: EXP, $: ExtensionEnv): [TFLAGS, U] {
        const retval = dpower(lhs, rhs, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_NONE, retval];
    }
}

export const derivative_2_pow_any = mkbuilder(Op);
