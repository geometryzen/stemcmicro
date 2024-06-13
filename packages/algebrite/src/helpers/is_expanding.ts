import { ExprContext } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";

export function is_expanding(env: Pick<ExprContext, "getDirective">): boolean {
    return env.getDirective(Directive.expanding) > 0;
}
