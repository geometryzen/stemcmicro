import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { Native } from "../../native/Native";
import { native_sym } from "../../native/native_sym";
import { booF } from "../../tree/boo/Boo";
import { Sym } from "../../tree/sym/Sym";
import { Cons, U } from "../../tree/tree";
import { Cons1 } from "../helpers/Cons1";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

const ISZERO = native_sym(Native.iszero);

class Op extends Function1<U> implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('iszero_any', ISZERO, is_any, $);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform1(opr: Sym, arg: U, expr: Cons1<Sym, U>): [TFLAGS, U] {
        // console.lg(this.name, `${expr}`);
        // In general the answer will be false, but we really should delegate to others and instead return expr.
        return [TFLAG_NONE, booF];
    }
}

export const iszero_any = new Builder();
