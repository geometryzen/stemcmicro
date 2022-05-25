import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { print_in_mode } from "../../print";
import { defs, PRINTMODE_LIST } from "../../runtime/defs";
import { Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, makeList, NIL, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";
import { FNAME_PRINTLIST } from "./FNAME_PRINTLIST";

class Builder implements OperatorBuilder<U> {
    create($: ExtensionEnv): Operator<U> {
        return new PrintList($);
    }
}

/**
 * (printlist x) => NIL. Output is written onto defs.prints.
 */
class PrintList extends Function1<U> implements Operator<Cons> {
    readonly hash: string;
    constructor($: ExtensionEnv) {
        super('printlist_1_any', FNAME_PRINTLIST, is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        const $ = this.$;
        const argList = makeList(arg);
        if (is_cons(argList)) {
            const texts = print_in_mode(argList, PRINTMODE_LIST, $);
            defs.prints.push(...texts);
        }
        return [TFLAG_DIFF, NIL];
    }
}

export const printlist_1_any = new Builder();
