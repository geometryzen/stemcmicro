import { create_sym, Sym } from "math-expression-atoms";
import { Cons, is_atom, is_cons } from "math-expression-tree";
import { ExtensionEnv } from "../../env/ExtensionEnv";
import { ProgrammingError } from "../../programming/ProgrammingError";

export function eval_typeof(expr: Cons, $: Pick<ExtensionEnv, 'valueOf'>): Sym {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const arg = $.valueOf(head);
            try {
                if (is_cons(arg)) {
                    return create_sym('cons');
                }
                else if (is_atom(arg)) {
                    return create_sym(arg.type);
                }
                else if (arg.isnil) {
                    return create_sym('nil');
                }
                else {
                    throw new ProgrammingError();
                }
            }
            finally {
                arg.release();
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
