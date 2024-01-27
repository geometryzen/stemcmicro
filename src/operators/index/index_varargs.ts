import { Native, native_sym } from "math-expression-native";
import { Cons, U } from "math-expression-tree";
import { Eval_index } from "../../calculators/get_component";
import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF, TFLAG_HALT } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

export const COMPONENT = native_sym(Native.component);

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly #hash: string;
    constructor($: ExtensionEnv) {
        super('index_varargs', COMPONENT, $);
        this.#hash = hash_nonop_cons(this.opr);
    }
    get hash(): string {
        return this.#hash;
    }
    valueOf(expr: Cons): U {
        return Eval_index(expr, this.$);
    }
    transform(expr: Cons): [number, U] {
        const $ = this.$;
        const retval = Eval_index(expr, $);
        const changed = !retval.equals(expr);
        return [changed ? TFLAG_DIFF : TFLAG_HALT, retval];
    }
}

export const index_varargs = new Builder();
