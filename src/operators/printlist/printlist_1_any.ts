import { CHANGED, ExtensionEnv, Operator, OperatorBuilder, TFLAGS } from "../../env/ExtensionEnv";
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
    constructor($: ExtensionEnv) {
        super('printlist_1_any', FNAME_PRINTLIST, is_any, $);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        const $ = this.$;
        const explicate = $.explicateMode;
        const prettying = $.prettyfmtMode;
        const implicate = $.implicateMode;
        $.setExplicate(false);
        $.setPrettyFmt(false);
        $.setImplicate(false);
        try {
            const value = $.valueOf(arg);
            const argList = makeList(value);
            if (is_cons(argList)) {
                const texts = print_in_mode(argList, PRINTMODE_LIST, $);
                defs.prints.push(...texts);
            }
            return [CHANGED, NIL];
        }
        finally {
            $.setExplicate(explicate);
            $.setPrettyFmt(prettying);
            $.setImplicate(implicate);
        }
    }
}

export const printlist_1_any = new Builder();
