import { Boo, booF, Sym } from "math-expression-atoms";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, U } from "math-expression-tree";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
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
        if (is_atom(arg)) {
            const handler = this.$.handlerFor(arg);
            return [TFLAG_NONE, Boo.valueOf(handler.test(arg, ISZERO, this.$))];
        }
        else {
            return [TFLAG_NONE, booF];
        }
    }
}

export const iszero_any = new Builder();
