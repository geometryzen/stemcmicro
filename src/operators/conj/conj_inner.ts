import { EnvConfig } from "../../env/EnvConfig";
import { mkbuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { Sym } from "../../tree/sym/Sym";
import { is_cons, items_to_cons, U } from "../../tree/tree";
import { and } from "../helpers/and";
import { Cons2 } from "../helpers/Cons2";
import { Function1 } from "../helpers/Function1";
import { is_inner_2_any_any } from "../inner/is_inner_2_any_any";
import { MATH_CONJ } from "./MATH_CONJ";

/**
 * conj(inner(y,x)) = inner(x,y)
 */
class ConjInner extends Function1<Cons2<Sym, U, U>> {
    constructor(readonly config: Readonly<EnvConfig>) {
        super('conj_inner', MATH_CONJ, and(is_cons, is_inner_2_any_any));
    }
    transform1(opr: Sym, arg: Cons2<Sym, U, U>): [TFLAGS, U] {
        return [TFLAG_DIFF, items_to_cons(arg.opr, arg.rhs, arg.lhs)];
    }
}

export const conj_inner = mkbuilder(ConjInner);
