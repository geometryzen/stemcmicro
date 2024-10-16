import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { divide } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

export function divide_expand(lhs: U, rhs: U, $: Pick<ExprContext, "getDirective" | "valueOf" | "pushDirective" | "popDirective">): U {
    $.pushDirective(Directive.expanding, 1);
    try {
        return divide(lhs, rhs, $);
    } finally {
        $.popDirective();
    }
}
