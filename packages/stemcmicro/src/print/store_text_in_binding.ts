import { assert_str, Sym } from "@stemcmicro/atoms";
import { scan } from "../algebrite/scan";
import { Directive, ExtensionEnv, flag_from_directive } from "../env/ExtensionEnv";

/**
 * @param text The text that will be the binding value.
 * @param sym The symbol that will be used as a key to store the text.
 */
export function store_text_in_binding(text: string, sym: Sym, $: ExtensionEnv): void {
    // TODO: Not clear why we go to the trouble to scan the string when we'll just get a string.
    // It does not seem that reliable anyway given the simplistic escaping of the text.
    // Fails when the text is aleady contains double quotes.
    const sourceText = JSON.stringify(text);
    // TOOD: Need a better routing to initialize the ScanOptions.
    const [scanned, tree] = scan(sourceText, 0, {
        useCaretForExponentiation: flag_from_directive($.getDirective(Directive.useCaretForExponentiation)),
        useParenForTensors: flag_from_directive($.getDirective(Directive.useParenForTensors)),
        explicitAssocAdd: false,
        explicitAssocMul: false,
        explicitAssocExt: false
    });
    if (scanned === sourceText.length) {
        const str = assert_str(tree);
        $.setBinding(sym, str);
    } else {
        // TODO
        // throw new SystemError(`${JSON.stringify(text)}`);
    }
}
