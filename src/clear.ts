import { ExtensionEnv } from './env/ExtensionEnv';
import { is_sym } from './operators/sym/is_sym';
import { clear_patterns } from './pattern';
import { halt } from './runtime/defs';
import { execute_script } from './runtime/execute';
import { define_special_symbols, execute_definitions } from './runtime/init';
import { stack_push } from './runtime/stack';
import { car, cdr, Cons, is_cons, nil, U } from './tree/tree';

/* clearall =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

General description
-------------------

Completely wipes all variables from the environment.

*/
export function Eval_clearall($: ExtensionEnv) {
    clear_patterns();

    $.clearBindings();

    // Don't redo the keywords or NIL.
    define_special_symbols($);

    // We need to redo these...
    execute_definitions(void 0, $);

    stack_push(nil);
}

// clearall from application GUI code
export function clearall($: ExtensionEnv): void {
    execute_script('clearall', $);
}

/* clear =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------

Completely wipes a variable from the environment (while doing x = quote(x) just unassigns it).

*/
export function Eval_clear(expr: Cons, $: ExtensionEnv): void {

    let p2: U = expr.cdr;
    while (is_cons(p2)) {
        const varName = car(p2);

        if (is_sym(varName)) {
            $.remove(varName);
        }
        else {
            halt('symbol error');
        }

        p2 = cdr(p2);
    }

    stack_push(nil);
}
