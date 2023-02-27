import { ExtensionEnv, Operator, OperatorBuilder, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { hash_nonop_cons } from "../../hashing/hash_info";
import { clear_patterns } from "../../pattern";
import { CLEARALL } from "../../runtime/constants";
import { execute_std_definitions } from "../../runtime/init";
import { Cons, nil, U } from "../../tree/tree";
import { FunctionVarArgs } from "../helpers/FunctionVarArgs";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new Op($);
    }
}

class Op extends FunctionVarArgs implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('clearall', CLEARALL, $);
        this.hash = hash_nonop_cons(this.opr);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transform(expr: Cons): [number, U] {
        const $ = this.$;

        clear_patterns();

        $.clearBindings();

        // We need to redo these...
        execute_std_definitions($);

        return [TFLAG_DIFF, nil];
    }
}

export const clearall_extension = new Builder();
