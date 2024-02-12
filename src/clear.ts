import { is_sym } from 'math-expression-atoms';
import { car, cdr, Cons, is_cons, nil, U } from 'math-expression-tree';
import { ExtensionEnv } from './env/ExtensionEnv';
import { halt } from './runtime/defs';

export function eval_clearall($: ExtensionEnv): U {

    $.clearBindings();

    $.executeProlog($.getProlog());

    return nil;
}

export function eval_clear(expr: Cons, $: ExtensionEnv): U {

    let argList: U = expr.argList;
    while (is_cons(argList)) {
        const varName = car(argList);

        if (is_sym(varName)) {
            $.remove(varName);
        }
        else {
            halt('symbol error');
        }

        argList = cdr(argList);
    }

    return nil;
}
