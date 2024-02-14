import { create_sym, Sym } from "math-expression-atoms";
import { Cons, is_cons, items_to_cons, nil, U } from "math-expression-tree";
import { Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF } from "../../env/ExtensionEnv";
import { HASH_ANY, hash_unaop_atom } from "../../hashing/hash_info";
import { print_in_mode } from "../../print/print_in_mode";
import { PrintMode } from "../../runtime/defs";
import { Function1 } from "../helpers/Function1";
import { is_any } from "../helpers/is_any";

export class PrintModeOperator extends Function1<U> implements Extension<Cons> {
    readonly #hash: string;
    constructor(opr: string, private readonly printMode: () => PrintMode) {
        super(opr, create_sym(opr), is_any);
        this.#hash = hash_unaop_atom(this.opr, HASH_ANY);
    }
    get hash(): string {
        return this.#hash;
    }
    transform1(opr: Sym, arg: U, expr: Cons, $: ExtensionEnv): [TFLAGS, U] {
        const argList = items_to_cons(arg);
        if (is_cons(argList)) {
            const texts = print_in_mode(argList, this.printMode(), $);
            const printHandler = $.getPrintHandler();
            printHandler.print(...texts);
        }
        return [TFLAG_DIFF, nil];
    }
}

class Builder implements ExtensionBuilder<U> {
    constructor(private readonly opr: string, private readonly printMode: () => PrintMode) {
    }
    create(): Extension<U> {
        return new PrintModeOperator(this.opr, this.printMode);
    }
}

export function make_printmode_operator(opr: string, printMode: () => PrintMode) {
    return new Builder(opr, printMode);
}
