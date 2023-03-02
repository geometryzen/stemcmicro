import { ExtensionEnv, Operator, OperatorBuilder, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { get_last_print_mode_symbol, store_text_in_binding } from "../../print/print";
import { render_using_print_mode } from "../../print/render_using_print_mode";
import { defs, PrintMode } from "../../runtime/defs";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { create_sym } from "../../tree/sym/Sym";
import { nil, U } from "../../tree/tree";
import { KeywordOperator } from "../helpers/KeywordSymbol";
import { is_sym } from "../sym/is_sym";
import { TYPE_NAME_SYM } from "../sym/TYPE_NAME_SYM";

export class PrintKeyword extends KeywordOperator {
    constructor(keyword: string, private readonly printMode: () => PrintMode, $: ExtensionEnv) {
        super(create_sym(keyword), $);
    }
    get key(): string {
        return TYPE_NAME_SYM.name;
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword.text;
    }
    transform(expr: U): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword)) {
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
        return new PrintKeyword(this.keyword, this.printMode, $);
    }
}

export function make_printmode_keyword(keyword: string, printMode: () => PrintMode) {
    return new Builder(keyword, printMode);
}
