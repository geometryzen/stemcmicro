import { is_str } from "@stemcmicro/atoms";
import { pop, ProgramControl, ProgramEnv, ProgramStack, push, stopf, value_of } from "@stemcmicro/eigenmath";
import { Cons } from "@stemcmicro/tree";
import { cadr } from "../../tree/helpers";
import { create_uom, is_uom_name } from "./uom";

export function stack_uom(expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
    push(cadr(expr), $);
    value_of(env, ctrl, $);

    const strname = pop($);
    if (is_str(strname)) {
        const name = strname.str;
        if (is_uom_name(name)) {
            const uom = create_uom(name);
            push(uom, $);
        } else {
            stopf(``);
        }
    } else {
        stopf(``);
    }
}
