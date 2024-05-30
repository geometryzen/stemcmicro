import { ExprContext } from "math-expression-context";
import { Directive } from "../env/ExtensionEnv";

export function is_expanding(env: Pick<ExprContext, "getDirective">): boolean {
    return env.getDirective(Directive.expanding) > 0;
}
