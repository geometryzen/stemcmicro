import { assert_str, create_sym } from "math-expression-atoms";
import { ExprContext } from "math-expression-context";
import { items_to_cons, U } from "math-expression-tree";

const INFIXFORM = create_sym("infixform");

export function infixform(arg: U, env: Pick<ExprContext, 'valueOf'>): string {
    const raw = items_to_cons(INFIXFORM, arg);
    try {
        return assert_str(env.valueOf(raw)).str;
    }
    finally {
        raw.release();
    }
}
