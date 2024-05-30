import { ExprContext } from "math-expression-context";
import { Native, native_sym } from "math-expression-native";
import { Cons, is_atom, items_to_cons, U } from "math-expression-tree";

const GRADE = native_sym(Native.grade);

export function eval_grade(expr: Cons, $: ExprContext): U {
    const argList = expr.argList;
    try {
        const item0 = argList.item0;
        const item1 = argList.item1;
        try {
            const x = $.valueOf(item0);
            const n = $.valueOf(item1);
            try {
                return grade(x, n, $);
            } finally {
                x.release();
                n.release();
            }
        } finally {
            item0.release();
            item1.release();
        }
    } finally {
        argList.release();
    }
}

function grade(x: U, n: U, $: ExprContext): U {
    if (is_atom(x)) {
        const handler = $.handlerFor(x);
        const argList = items_to_cons(n);
        try {
            return handler.dispatch(x, GRADE, argList, $);
        } finally {
            argList.release();
        }
    }
    return x;
}
