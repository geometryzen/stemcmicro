
import { Flt, is_err, is_flt, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons2, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { ExtensionEnv, FEATURE, mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom, HASH_FLT } from "../../hashing/hash_info";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

type LHS = U;
type RHS = Flt;
type EXP = Cons2<Sym, LHS, RHS>

class Op extends Function2<LHS, RHS> {
    readonly #hash: string;
    readonly dependencies: FEATURE[] = [];
    constructor(readonly config: Readonly<EnvConfig>) {
        super('mul_2_any_flt', native_sym(Native.multiply), is_any, is_flt);
        this.#hash = hash_binop_atom_atom(native_sym(Native.multiply), HASH_ANY, HASH_FLT);
    }
    get hash(): string {
        return this.#hash;
    }
    isKind(expr: U, $: ExtensionEnv): expr is EXP {
        if (super.isKind(expr, $)) {
            const rhs = expr.rhs;
            return rhs.isZero();
        }
        else {
            return false;
        }
    }
    transform2(opr: Sym, lhs: LHS, rhs: RHS): [TFLAGS, U] {
        if (is_err(lhs)) {
            return [TFLAG_DIFF, lhs];
        }
        else if (rhs.isZero()) {
            // TODO: We could be wrong here. e.g. if the lhs is a Tensor, we lose the structure.
            return [TFLAG_DIFF, rhs];
        }
        else {
            throw new Error();
        }
    }
}

export const mul_2_any_flt = mkbuilder(Op);
