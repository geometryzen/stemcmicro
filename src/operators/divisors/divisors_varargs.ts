import { Cons, U } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { divisors } from "./divisors";

export function Eval_divisors(expr: Cons, $: ExtensionEnv): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const term = $.valueOf(head);
            try {
                return divisors(term, $);
            }
            finally {
                term.release();
            }
        }
        finally {
            head.release();
        }
    }
    finally {
        argList.release();
    }
}
