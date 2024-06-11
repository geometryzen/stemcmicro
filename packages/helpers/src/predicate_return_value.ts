import { Boo, booF, booT, one, Rat, zero } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";

export function predicate_return_value(value: boolean, $: Pick<ExprContext, "getDirective">): Boo | Rat {
    if (typeof value !== "boolean") {
        throw new Error(`The value parameter (${JSON.stringify(value)}) must be a boolean.`);
    }
    if ($.getDirective(Directive.useIntegersForPredicates)) {
        return value ? one : zero;
    } else {
        return value ? booT : booF;
    }
}
