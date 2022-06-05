import { count_size } from "../runtime/count";
import { ExtensionEnv } from "./ExtensionEnv";

/**
 * TODO: To work, this function needs countsize, which will have to know about extension types.
 * TODO: Can this be changed to return structured information?
 */
export function symbolsinfo($: ExtensionEnv): string {
    let str = '';
    const bnds = $.getBindings();
    for (const { sym, binding } of bnds) {
        const printname = sym.key();
        if (binding) {
            const bindingi = (`${$.toSExprString(binding)}`).substring(0, 4);
            str +=
                'symbol: ' +
                printname +
                ' size: ' +
                count_size(binding, $) +
                ' value: ' +
                bindingi +
                '...\n';
        }
    }
    return str;
}
