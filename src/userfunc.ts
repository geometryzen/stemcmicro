import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { Eval_derivative } from './operators/derivative/Eval_derivative';
import { is_num } from './operators/num/is_num';
import { is_str } from './operators/str/is_str';
import { is_sym } from './operators/sym/is_sym';
import { is_tensor } from './operators/tensor/is_tensor';
import { EVAL, FUNCTION, SYMBOL_D } from './runtime/constants';
import { DEBUG, defs, halt } from './runtime/defs';
import { stack_list, stack_pop, stack_push } from './runtime/stack';
import { cadr, cddr } from './tree/helpers';
import { Tensor } from './tree/tensor/Tensor';
import { car, cdr, Cons, is_cons, U } from './tree/tree';

// Evaluate a user defined function

// F is the function body
// A is the formal argument list
// B is the calling argument list
// S is the argument substitution list

// we got here because there was a function invocation and
// it's not been parsed (and consequently tagged) as any
// system function.
// So we are dealing with another function.
// The function could be actually defined, or not yet,
// so we'll deal with both cases.

/* d =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
f,x

General description
-------------------
Returns the partial derivative of f with respect to x. x can be a vector e.g. [x,y].

*/
export function Eval_user_function(expr: Cons, $: ExtensionEnv): U {
    // Use "derivative" instead of "d" if there is no user function "d"
    if (DEBUG) {
        // eslint-disable-next-line no-console
        // console.lg(`Eval_user_function evaluating: ${car(expr)}`);
    }
    if (car(expr).equals(SYMBOL_D) && $.getSymbolValue(SYMBOL_D).equals(SYMBOL_D)) {
        const retval = Eval_derivative(expr, $);
        return retval;
    }

    // normally car(p1) is a symbol with the function name
    // but it could be something that has to be
    // evaluated to get to the function definition instead
    // (e.g. the function is an element of an array)
    // so we do an eval to sort it all out.

    // we expect to find either the body and
    // formula arguments, OR, if the function
    // has not been defined yet, then the
    // function will just contain its own name, as
    // all undefined variables do.
    const bodyAndFormalArguments = $.valueOf(car(expr));

    if (is_num(bodyAndFormalArguments)) {
        halt(
            "expected function invocation, found multiplication instead. Use '*' symbol explicitly for multiplication."
        );
    }
    else if (is_tensor(bodyAndFormalArguments)) {
        halt(
            "expected function invocation, found tensor product instead. Use 'dot/inner' explicitly."
        );
    }
    else if (is_str(bodyAndFormalArguments)) {
        halt('expected function, found string instead.');
    }

    const F = car(cdr(bodyAndFormalArguments));
    // p4 is the formal argument list
    // that is also contained here in the FUNCTION node
    const A = car(cdr(cdr(bodyAndFormalArguments)));

    const B = cdr(expr);

    // example:
    //  f(x) = x+2
    // then:
    //  toInfixString(F) = "x + 2"
    //  A = x
    //  B = 2

    // first check is whether we don't obtain a function
    if (
        !car(bodyAndFormalArguments).equals(FUNCTION) ||
        // next check is whether evaluation did nothing, so the function is undefined
        bodyAndFormalArguments.equals(car(expr))
    ) {
        // leave everything as it was and return
        const h = defs.tos;
        stack_push(bodyAndFormalArguments);
        let p1 = B;
        while (is_cons(p1)) {
            stack_push($.valueOf(car(p1)));
            p1 = cdr(p1);
        }
        stack_list(defs.tos - h);
        return stack_pop();
    }

    // Create the argument substitution list S
    let p1 = A;
    let p2 = B;
    const h = defs.tos;
    while (is_cons(p1) && is_cons(p2)) {
        stack_push(car(p1));
        stack_push(car(p2));
        // why explicitly Eval the parameters when
        // the body of the function is
        // evalled anyways? Commenting it out. All tests pass...
        //Eval()
        p1 = cdr(p1);
        p2 = cdr(p2);
    }

    stack_list(defs.tos - h);
    const S = stack_pop();

    // Evaluate the function body
    stack_push(F);
    if (is_cons(S)) {
        stack_push(S);
        rewrite_args($);
    }
    // console.lg "rewritten body: " + stack[tos-1]
    return $.valueOf(stack_pop());
}

// Rewrite by expanding symbols that contain args
function rewrite_args($: ExtensionEnv) {
    let n = 0;

    // subst. list which is a list
    // where each consecutive pair
    // is what needs to be substituted and with what
    const p2 = stack_pop();
    // console.lg "subst. list " + p2

    // expr to substitute in i.e. the
    // function body
    let p1 = stack_pop();
    // console.lg "expr: " + p1

    if (is_tensor(p1)) {
        n = rewrite_args_tensor(p1, p2, $);
        return n;
    }

    if (is_cons(p1)) {
        const h = defs.tos;
        if (car(p1).equals(car(p2))) {
            // rewrite a function in
            // the body with the one
            // passed from the paramaters
            stack_push(makeList(EVAL, car(cdr(p2))));
        }
        else {
            // if there is no match
            // then no substitution necessary
            stack_push(car(p1));
        }

        // continue recursively to
        // rewrite the rest of the body
        p1 = cdr(p1);
        while (is_cons(p1)) {
            stack_push(car(p1));
            stack_push(p2);
            n += rewrite_args($);
            p1 = cdr(p1);
        }
        stack_list(defs.tos - h);
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
        stack_push(p1);
        return 0;
    }

    // Here we are in a symbol case
    // so we need to substitute

    // Check if there is a direct match
    // of symbols right away
    let p3 = p2;
    while (is_cons(p3)) {
        if (p1.equals(car(p3))) {
            stack_push(cadr(p3));
            return 1;
        }
        p3 = cddr(p3);
    }

    // Get the symbol's content, if _that_
    // matches then do the substitution
    p3 = $.getSymbolValue(p1);
    stack_push(p3);
    if (p1 !== p3) {
        stack_push(p2); // subst. list
        n = rewrite_args($);
        if (n === 0) {
            stack_pop();
            stack_push(p1); // restore if not rewritten with arg
        }
    }

    return n;
}

function rewrite_args_tensor(M: Tensor, other: U, $: ExtensionEnv) {
    let rewrite_args_counter = 0;
    const elems = M.mapElements((m) => {
        stack_push(m);
        stack_push(other);
        rewrite_args_counter += rewrite_args($);
        return stack_pop();
    });

    stack_push(M.withElements(elems));
    return rewrite_args_counter;
}
