import { TFLAG_DIFF, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
import { HASH_STR, hash_unaop_atom } from "../../hashing/hash_info";
import { Str } from "../../tree/str/Str";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_str } from "../str/str_extension";
import { uom } from "./uom";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new UomStr($);
    }
}

/**
 * (uom Str) 
 */
class UomStr extends Function1<Str> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('uom_1_str', new Sym('uom'), is_str, $);
        this.hash = hash_unaop_atom(new Sym('uom'), HASH_STR);
    }
    transform1(opr: Sym, arg: Str): [TFLAGS, U] {
        return [TFLAG_DIFF, uom(arg.str)];
    }
}

export const uom_1_str = new Builder();
