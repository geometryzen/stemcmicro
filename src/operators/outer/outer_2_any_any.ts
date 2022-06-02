
import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { MATH_OUTER } from "../../runtime/ns_math";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { BCons } from "../helpers/BCons";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<Cons> {
    constructor(private readonly opr: Sym) {
    }
    create($: ExtensionEnv): Operator<Cons> {
        return new Op(this.opr, $);
    }
}

class Op extends Function2<U, U> implements Operator<Cons> {
    readonly hash: string;
    constructor(opr: Sym, $: ExtensionEnv) {
        super('outer_2_any_any', opr, is_any, is_any, $);
        this.hash = hash_binop_atom_atom(this.opr, HASH_ANY, HASH_ANY);
    }
    transform2(opr: Sym, lhs: U, rhs: U, expr: BCons<Sym, U, U>): [TFLAGS, U] {
        // console.log(`${this.name}`);
        return [TFLAG_NONE, expr];
    }
}

export const outer_2_any_any = new Builder(MATH_OUTER);
