import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_RAT, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { Rat } from "../../tree/rat/Rat";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { UCons } from "../helpers/UCons";
import { is_rat } from "../rat/is_rat";
import { wrap_as_transform } from "../wrap_as_transform";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends Function1<Rat> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('abs_rat', native_sym(Native.abs), is_rat, $);
        this.hash = hash_unaop_atom(this.opr, HASH_RAT);
    }
    transform1(opr: Sym, arg: Rat, expr: UCons<Sym, Rat>): [TFLAGS, U] {
        return wrap_as_transform(arg.abs(), expr);
    }
}

export const abs_rat = new Builder();
