import { ExtensionEnv, NOFLAGS, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { SYM_MATH_COMPONENT } from "../../runtime/constants";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function2<U, U> implements Operator<U> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('index_2_any_any', SYM_MATH_COMPONENT, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(SYM_MATH_COMPONENT, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        return [NOFLAGS, expr];
    }
}

export const index_2_any_any = new Builder();
