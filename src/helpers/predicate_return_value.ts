import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { Boo, booF, booT } from "../tree/boo/Boo";
import { one, Rat, zero } from "../tree/rat/Rat";

export function predicate_return_value(value: boolean, $: ExtensionEnv): Boo | Rat {
    if (typeof value !== 'boolean') {
        throw new Error(`The value parameter (${JSON.stringify(value)}) must be a boolean.`);
    }
    if ($.getDirective(Directive.useIntegersForPredicates)) {
        return value ? one : zero;
    }
    else {
        return value ? booT : booF;
    }
}
