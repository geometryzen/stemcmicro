import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { get_last_print_mode_symbol } from "../../print/print";
import { render_using_print_mode } from "../../print/render_using_print_mode";
import { store_text_in_binding } from "../../print/store_text_in_binding";
import { defs, PrintMode } from "../../runtime/defs";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { create_sym, Sym } from "../../tree/sym/Sym";
import { nil, U } from "../../tree/tree";
import { AbstractKeywordOperator } from "../helpers/KeywordSymbol";
import { is_sym } from "../sym/is_sym";

/**
 * TODO:
 */
export class PrintKeyword extends AbstractKeywordOperator {
    constructor(keyword: Sym, private readonly printMode: () => PrintMode, $: ExtensionEnv) {
        super(keyword, $);
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword().key();
    }
    transform(expr: U): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword())) {
            const $ = this.$;
            const printMode: PrintMode = this.printMode();
            const origPrintMode = defs.printMode;
            defs.setPrintMode(printMode);
            try {
                const last = $.getBinding(RESERVED_KEYWORD_LAST);
                const str = render_using_print_mode(last, printMode, $);

                const printHandler = this.$.getPrintHandler();
                printHandler.print(str);

                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);

                return [TFLAG_DIFF, nil];
            }
            finally {
                defs.setPrintMode(origPrintMode);
            }
        }
        return [TFLAG_NONE, expr];
    }
}

class Builder implements OperatorBuilder<U> {
    constructor(private readonly keyword: string, private readonly printMode: () => PrintMode) {

    }
    create($: ExtensionEnv): Operator<U> {
        return new PrintKeyword(create_sym(this.keyword), this.printMode, $);
    }
}

export function make_printmode_function(keyword: string, printMode: () => PrintMode) {
    return new Builder(keyword, printMode);
}
