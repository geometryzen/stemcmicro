import { Directive, ExtensionEnv } from "../env/ExtensionEnv";
import { Boo, booF, booT } from "../tree/boo/Boo";
import { one, Rat, zero } from "../tree/rat/Rat";

export function predicate_return_value(value: boolean, $: Pick<ExtensionEnv, "getDirective">): Boo | Rat {
    // console.lg("predicate_return_value", value);
    if (typeof value !== "boolean") {
        throw new Error(`The value parameter (${JSON.stringify(value)}) must be a boolean.`);
    }
    if ($.getDirective(Directive.useIntegersForPredicates)) {
        // console.lg("useIntegersForPredicates", true);
        return value ? one : zero;
    } else {
        // console.lg("useIntegersForPredicates", false);
        return value ? booT : booF;
    }
}
