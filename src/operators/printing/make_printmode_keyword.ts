import { create_sym, is_sym, Sym } from "math-expression-atoms";
import { nil, U } from "math-expression-tree";
import { EnvConfig } from "../../env/EnvConfig";
import { Directive, Extension, ExtensionBuilder, ExtensionEnv, TFLAGS, TFLAG_DIFF, TFLAG_NONE } from "../../env/ExtensionEnv";
import { HASH_SYM } from "../../hashing/hash_info";
import { get_last_print_mode_symbol } from "../../print/print";
import { render_using_print_mode } from "../../print/render_using_print_mode";
import { store_text_in_binding } from "../../print/store_text_in_binding";
import { PrintMode } from "../../runtime/defs";
import { RESERVED_KEYWORD_LAST } from "../../runtime/ns_script";
import { AbstractKeywordExtension } from "../helpers/KeywordSymbol";

/**
 * TODO:
 */
export class PrintKeyword extends AbstractKeywordExtension {
    constructor(keyword: Sym, private readonly printMode: () => PrintMode, readonly config: Readonly<EnvConfig>) {
        super(keyword, config);
    }
    get hash(): string {
        return HASH_SYM;
    }
    get name(): string {
        return this.keyword().key();
    }
    transform(expr: U, $: ExtensionEnv): [TFLAGS, U] {
        // Because of our hash, we are being matched with any symbol.
        if (is_sym(expr) && expr.equalsSym(this.keyword())) {
            const printMode: PrintMode = this.printMode();
            $.pushDirective(Directive.printMode, this.printMode());
            try {
                const last = $.getBinding(RESERVED_KEYWORD_LAST, nil);
                const str = render_using_print_mode(last, printMode, $);

                const printHandler = $.getPrintHandler();
                printHandler.print(str);

                store_text_in_binding(str, get_last_print_mode_symbol(printMode), $);

                return [TFLAG_DIFF, nil];
            }
            finally {
                $.popDirective();
            }
        }
        return [TFLAG_NONE, expr];
    }
}

class Builder implements ExtensionBuilder<U> {
    constructor(private readonly keyword: string, private readonly printMode: () => PrintMode) {

    }
    create(config: Readonly<EnvConfig>): Extension<U> {
        return new PrintKeyword(create_sym(this.keyword), this.printMode, config);
    }
}

export function make_printmode_function(keyword: string, printMode: () => PrintMode) {
    return new Builder(keyword, printMode);
}
