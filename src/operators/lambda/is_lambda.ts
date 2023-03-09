import { Lambda } from "../../tree/lambda/Lambda";
import { U } from "../../tree/tree";

export function is_lambda(expr: U): expr is Lambda {
    return expr instanceof Lambda;
}
