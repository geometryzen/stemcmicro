import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_binop_atom_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { imu } from "../../tree/imu/Imu";
import { Sym } from "../../tree/sym/Sym";
import { U } from "../../tree/tree";
import { Function2 } from "../helpers/Function2";
import { is_any } from "../helpers/is_any";

const COMPLEX = native_sym(Native.complex);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

/**
 * complex(x, y) => x + i * y
 */
class Op extends Function2<U, U> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('complex_2_any_any', COMPLEX, is_any, is_any, $);
        this.#hash = hash_binop_atom_atom(COMPLEX, HASH_ANY, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform2(opr: Sym, x: U, y: U): [TFLAGS, U] {
        const $ = this.$;
        return [TFLAG_DIFF, $.add(x, $.multiply(imu, y))];
    }
}

export const complex_2_any_any = new Builder();
