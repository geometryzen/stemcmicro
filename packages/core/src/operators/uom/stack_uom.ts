import { is_str } from "@stemcmicro/atoms";
import { Cons } from "@stemcmicro/tree";
import { pop, push, stopf, value_of } from "../../eigenmath/eigenmath";
import { ProgramControl } from "../../eigenmath/ProgramControl";
import { ProgramEnv } from "../../eigenmath/ProgramEnv";
import { ProgramStack } from "../../eigenmath/ProgramStack";
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
