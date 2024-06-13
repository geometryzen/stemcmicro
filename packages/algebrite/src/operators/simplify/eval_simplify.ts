import { Cons, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { simplify } from "./simplify";

export function eval_simplify(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const arg = argList.head;
        try {
            const x = $.valueOf(arg);
            try {
                return simplify(x, $);
            } finally {
                x.release();
            }
        } finally {
            arg.release();
        }
    } finally {
        argList.release();
    }
}
