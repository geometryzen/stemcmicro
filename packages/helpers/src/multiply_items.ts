import { one } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { U } from "@stemcmicro/tree";
import { multiply } from "./multiply";

/**
 * TODO: Why doesn't this function perform sorting of the factors?
 * multiply n factors
 * [a b c d ...] => (multiply (multiply a b) c)
 * @param items is an integer
 */
export function multiply_items(items: U[], _: Pick<ExprContext, "valueOf">): U {
    // console.lg(`multiply_items items => ${items_to_infix(items, $)} ${items_to_sexpr(items, $)}`);
    if (items.length > 1) {
        let temp = items[0];
        for (let i = 1; i < items.length; i++) {
            temp = multiply(_, temp, items[i]);
        }
        return temp;
    } else {
        if (items.length === 1) {
            return items[0];
        }
        return one;
    }
}
