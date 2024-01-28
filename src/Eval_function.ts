import { ExtensionEnv } from './env/ExtensionEnv';
import { StackU } from './env/StackU';
import { items_to_cons } from './makeList';
import { Eval_derivative } from './operators/derivative/Eval_derivative';
import { is_num } from './operators/num/is_num';
import { is_str } from './operators/str/is_str';
import { is_sym } from './operators/sym/is_sym';
import { is_tensor } from './operators/tensor/is_tensor';
import { EVAL, FUNCTION, SYMBOL_D } from './runtime/constants';
import { halt } from './runtime/defs';
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
export function Eval_function(expr: Cons, $: ExtensionEnv): U {
    // console.lg("Eval_function");


    // Use "derivative" instead of "d" if there is no user function "d"
    // TODO: This needs to be checked because of the way getSymbolValue behaves.
    if (car(expr).equals(SYMBOL_D) && $.getBinding(SYMBOL_D).equals(SYMBOL_D)) {
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
    // console.lg("bodyAndFormalArguments", $.toInfixString(bodyAndFormalArguments));

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
    // console.lg("F", $.toInfixString(F));
    // A is the formal argument list i.e. the list or parameters.
    // that is also contained here in the FUNCTION node
    const A = car(cdr(cdr(bodyAndFormalArguments)));
    // console.lg("A", $.toInfixString(A));

    /**
     * The argument list.
     */
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
        const stack = new StackU();
        const h = stack.tos;
        stack.push(bodyAndFormalArguments);
        let p1 = B;
        while (is_cons(p1)) {
            stack.push($.valueOf(car(p1)));
            p1 = cdr(p1);
        }
        stack.list(stack.tos - h);
        return stack.pop();
    }

    // Create the argument substitution list S
    // console.lg("A", A.toString());
    // console.lg("B", B.toString());
    let p1 = A;
    let p2 = B;
    const stack = new StackU();
    const h = stack.tos;
    while (is_cons(p1) && is_cons(p2)) {
        stack.push(car(p1));
        stack.push(car(p2));
        // why explicitly Eval the parameters when
        // the body of the function is
        // evalled anyways? Commenting it out. All tests pass...
        //Eval()
        p1 = cdr(p1);
        p2 = cdr(p2);
    }

    stack.list(stack.tos - h);
    const S = stack.pop();

    // Evaluate the function body
    stack.push(F);
    if (is_cons(S)) {
        stack.push(S);
        rewrite_args(stack, $);
    }
    // console.lg "rewritten body: " + stack[tos-1]
    return $.valueOf(stack.pop());
}

// Rewrite by expanding symbols that contain args
function rewrite_args(stack: StackU, $: ExtensionEnv) {
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
            n += rewrite_args(stack, $);
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
        n = rewrite_args(stack, $);
        if (n === 0) {
            stack.pop();
            stack.push(p1); // restore if not rewritten with arg
        }
    }

    return n;
}

function rewrite_args_tensor(M: Tensor, other: U, stack: StackU, $: ExtensionEnv) {
    let rewrite_args_counter = 0;
    const elems = M.mapElements((m) => {
        stack.push(m);
        stack.push(other);
        rewrite_args_counter += rewrite_args(stack, $);
        return stack.pop();
    });

    stack.push(M.withElements(elems));
    return rewrite_args_counter;
}
