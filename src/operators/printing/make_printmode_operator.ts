import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { print_in_mode } from "../../print/print";
import { PrintMode } from "../../runtime/defs";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { Cons, is_cons, items_to_cons, nil, U } from "../../tree/tree";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export class PrintModeOperator extends Function1<U> implements Operator<Cons> {
    readonly hash: string;
    constructor(opr: string, private readonly printMode: () => PrintMode, $: ExtensionEnv) {
        super(opr, create_sym(opr), is_any, $);
        this.hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    transform1(opr: Sym, arg: U): [TFLAGS, U] {
        const $ = this.$;
        const argList = items_to_cons(arg);
        if (is_cons(argList)) {
            const texts = print_in_mode(argList, this.printMode(), $);
            const printHandler = this.$.getPrintHandler();
            printHandler.print(...texts);
        }
        return [TFLAG_DIFF, nil];
    }
}

class Builder implements OperatorBuilder<U> {
    constructor(private readonly opr: string, private readonly printMode: () => PrintMode) {
    }
    create($: ExtensionEnv): Operator<U> {
        return new PrintModeOperator(this.opr, this.printMode, $);
    }
}

export function make_printmode_operator(opr: string, printMode: () => PrintMode) {
    return new Builder(opr, printMode);
}
