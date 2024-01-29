import { assert_tensor, is_num, is_str, is_sym, is_tensor, Tensor } from 'math-expression-atoms';
import { car, cdr, Cons, is_cons, items_to_cons, U } from 'math-expression-tree';
import { ExtensionEnv } from '../../env/ExtensionEnv';
import { StackU } from '../../env/StackU';
import { zip } from '../../functional/zip';
import { Eval_derivative } from '../../operators/derivative/Eval_derivative';
import { EVAL, FN, SYMBOL_D } from '../../runtime/constants';
import { halt } from '../../runtime/defs';
import { cadr, cddr } from '../../tree/helpers';

function validate_fn_expr(expr: U): Cons {
    if (is_num(expr)) {
        halt(
            "expected function invocation, found multiplication instead. Use '*' symbol explicitly for multiplication."
        );
    }
    else if (is_tensor(expr)) {
        halt(
            "expected function invocation, found tensor product instead. Use 'dot/inner' explicitly."
        );
    }
    else if (is_str(expr)) {
        halt('expected function, found string instead.');
    }
    return assert_cons(expr);
}

function is_fn_expr(expr: U): boolean {
    if (is_cons(expr)) {
        const opr = expr.opr;
        try {
            return opr.equals(FN);
        }
        finally {
            opr.release();
        }
    }
    else {
        return false;
    }
}

function assert_cons(expr: U): Cons {
    if (is_cons(expr)) {
        return expr;
    }
    else {
        throw new Error();
    }
}

/**
 * e.g. (triple 7) => ((fn [x] (* 3 x)) 7) => 21
 */
export function Eval_lambda_in_fn_syntax(expr: Cons, $: ExtensionEnv): U {
    const opr = expr.opr;
    try {
        // Use "derivative" instead of "d" if there is no user function "d"
        // TODO: This needs to be checked because of the way getSymbolValue behaves.
        // TODO: Checking to see if a binding is the symbol is an unreliable way to see if the symbol is undefined.
        if (opr.equals(SYMBOL_D) && $.getBinding(SYMBOL_D).equals(SYMBOL_D)) {
            return Eval_derivative(expr, $);
        }

        const binding = is_fn_expr(opr) ? opr : $.valueOf(opr);
        try {
            if (!is_fn_expr(binding)) {
                const stack = new StackU();
                const h = stack.tos;
                stack.push(binding);
                let p1 = expr.argList;
                while (is_cons(p1)) {
                    stack.push($.valueOf(car(p1)));
                    p1 = cdr(p1);
                }
                stack.list(stack.tos - h);
                return stack.pop();
            }
            // (fn [param*] body)
            const fnExpr = validate_fn_expr(binding);
            const paramTensor = assert_tensor(fnExpr.item(1));
            const paramList = items_to_cons(...paramTensor.elems);
            const F = fnExpr.item(2);
            const argsList = expr.argList;
            try {
                const S = zip(paramList, argsList);

                if (is_cons(S)) {
                    return rewrite_args(F, S, $);
                }
                else {
                    return $.valueOf(F);
                }
            }
            finally {
                paramTensor.release();
                paramList.release();
                F.release();
                argsList.release();
            }
        }
        finally {
            binding.release();
        }
    }
    finally {
        opr.release();
    }
}

function rewrite_args(F: U, S: Cons, $: ExtensionEnv): U {
    const stack = new StackU();
    try {
        stack.push(F);
        stack.push(S);
        rewrite_args_recursive(stack, $);
        return $.valueOf(stack.pop());
    }
    finally {
        stack.release();
    }
}

// Rewrite by expanding symbols that contain args
function rewrite_args_recursive(stack: StackU, $: ExtensionEnv) {
    let n = 0;

    // subst. list which is a list
    // where each consecutive pair
    // is what needs to be substituted and with what
    const p2 = stack.pop();
    // console.lg "subst. list " + p2

    // expr to substitute in i.e. the
    // function body
    let p1 = stack.pop();
    // console.lg "expr: " + p1

    if (is_tensor(p1)) {
        n = rewrite_args_tensor(p1, p2, stack, $);
        return n;
    }

    if (is_cons(p1)) {
        const h = stack.tos;
        if (car(p1).equals(car(p2))) {
            // rewrite a function in
            // the body with the one
            // passed from the paramaters
            stack.push(items_to_cons(EVAL, car(cdr(p2))));
        }
        else {
            // if there is no match
            // then no substitution necessary
            stack.push(car(p1));
        }

        // continue recursively to
        // rewrite the rest of the body
        p1 = cdr(p1);
        while (is_cons(p1)) {
            stack.push(car(p1));
            stack.push(p2);
            n += rewrite_args_recursive(stack, $);
            p1 = cdr(p1);
        }
        stack.list(stack.tos - h);
        return n;
    }

    // ground cases here
    // (apart from function name which has
    // already been substituted as it's in the head
    // of the cons)
    // -----------------

    // If not a symbol then no
    // substitution to be done
    if (!is_sym(p1)) {
        stack.push(p1);
        return 0;
    }

    // Here we are in a symbol case
    // so we need to substitute

    // Check if there is a direct match
    // of symbols right away
    let p3 = p2;
    while (is_cons(p3)) {
        if (p1.equals(car(p3))) {
            stack.push(cadr(p3));
            return 1;
        }
        p3 = cddr(p3);
    }

    // Get the symbol's content, if _that_
    // matches then do the substitution
    p3 = $.getBinding(p1);
    stack.push(p3);
    if (p1 !== p3) {
        stack.push(p2); // subst. list
        n = rewrite_args_recursive(stack, $);
        if (n === 0) {
            stack.pop();
            stack.push(p1); // restore if not rewritten with arg
        }
    }

    return n;
}

function rewrite_args_tensor(M: Tensor, other: U, stack: StackU, $: ExtensionEnv): number {
    let rewrite_args_counter = 0;
    const elems = M.mapElements((m) => {
        stack.push(m);
        stack.push(other);
        rewrite_args_counter += rewrite_args_recursive(stack, $);
        return stack.pop();
    });

    stack.push(M.withElements(elems));
    return rewrite_args_counter;
}
