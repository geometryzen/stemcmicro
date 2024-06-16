import { is_str } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { value_of } from "@stemcmicro/eigenmath";
import { prolog_eval_varargs } from "@stemcmicro/helpers";
import { ProgramStack } from "@stemcmicro/stack";
import { cadr, Cons, U } from "@stemcmicro/tree";
import { create_uom, is_uom_name } from "./uom";

export function stack_uom(expr: Cons, env: ExprContext, $: ProgramStack): void {
    $.push(cadr(expr));
    value_of(env, $);

    const strname = $.pop();
    if (is_str(strname)) {
        const name = strname.str;
        if (is_uom_name(name)) {
            const uom = create_uom(name);
            $.push(uom);
        } else {
            throw new Error(`${name} is not a recognized unit of measure.`);
        }
    } else {
        throw new Error(``);
    }
}

export function eval_uom(expr: Cons, $: ExprContext): U {
    return prolog_eval_varargs(expr, handle_uom, $);
}

function handle_uom(values: Cons): U {
    const strname = values.item0;
    try {
        if (is_str(strname)) {
            const name = strname.str;
            if (is_uom_name(name)) {
                return create_uom(name);
            } else {
                throw new Error(`${name} is not a recognized unit of measure.`);
            }
        } else {
            throw new Error(``);
        }
    } finally {
        strname.release();
    }
}
