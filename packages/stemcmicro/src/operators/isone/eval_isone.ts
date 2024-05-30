import { Boo, booF, create_boo } from "@stemcmicro/atoms";
import { ExprContext } from "@stemcmicro/context";
import { Native, native_sym } from "@stemcmicro/native";
import { Cons, is_atom, U } from "@stemcmicro/tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";

const ISONE = native_sym(Native.isone);

export function eval_isone(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const x = $.valueOf(head);
            try {
                return isone(x, $);
            } finally {
                x.release();
            }
        } finally {
            head.release();
        }
    } finally {
        argList.release();
    }
}

function isone(x: U, $: ExprContext): Boo {
    if (is_atom(x)) {
        const handler = $.handlerFor(x);
        // It would be better here to dispatch and accept a fuzzy answer.
        const retval = handler.test(x, ISONE, $);
        return create_boo(retval);
    } else {
        return booF;
    }
}
