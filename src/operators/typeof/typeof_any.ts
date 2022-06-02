import { ExtensionEnv, TFLAG_NONE, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { UCons } from "../helpers/UCons";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new TypeofAny($);
    }
}

class TypeofAny extends Function1<U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('typeof_any', new Sym('typeof'), is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: U, expr: UCons<Sym, U>): [TFLAGS, U] {
        return [TFLAG_NONE, expr];
    }
}

export const typeof_any = new Builder();
