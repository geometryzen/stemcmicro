import { Hyp, is_sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { Cons, is_atom, U } from "math-expression-tree";
import { ProgrammingError } from "../../programming/ProgrammingError";

export function eval_differential(expr: Cons, env: ExprContext): U {
    const argList = expr.argList;
    try {
        const head = argList.head;
        try {
            const F = env.valueOf(head);
            try {
                return differential(F, env);
            }
            finally {
                F.release();
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function differential(F: U, env: ExprContext): U {
    if (is_atom(F)) {
        if (is_sym(F)) {
            // TODO: Need to have Hyp take a symbol in the constructor, not a string.
            return new Hyp(`d${F.key()}`, F.pos, F.end);
        }
    }
    throw new ProgrammingError("TODO: differential");
}
