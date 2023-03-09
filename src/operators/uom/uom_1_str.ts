import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_STR, hash_unaop_atom } from "../../hashing/hash_info";
import { Str } from "../../tree/str/Str";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_str } from "../str/str_extension";
import { create_uom } from "./uom";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new UomStr($);
    }
}

type UOM_STRING = 'kilogram' | 'meter' | 'second' | 'coulomb' | 'ampere' | 'kelvin' | 'mole' | 'candela';

/**
 * (uom Str) 
 */
class UomStr extends Function1<Str> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('uom_1_str', create_sym('uom'), is_str, $);
        this.hash = hash_unaop_atom(create_sym('uom'), HASH_STR);
    }
    transform1(opr: Sym, arg: Str): [TFLAGS, U] {
        // We are casting away the type safety knowing that the creation function will raise an exception.
        // How we choose to manage exceptions is TBD.
        return [TFLAG_DIFF, create_uom(arg.str as UOM_STRING)];
    }
}

export const uom_1_str = new Builder();
