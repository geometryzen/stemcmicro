import { ExtensionEnv } from './env/ExtensionEnv';
import { is_sym } from './operators/sym/is_sym';
import { clear_patterns } from './pattern';
import { halt } from './runtime/defs';
import { execute_std_definitions } from './runtime/init';
import { car, cdr, Cons, is_cons, nil, U } from './tree/tree';

export function Eval_clearall($: ExtensionEnv): U {
    clear_patterns();

    $.clearBindings();

    // We need to redo these...
    execute_std_definitions($);

    return nil;
}

export function Eval_clear(expr: Cons, $: ExtensionEnv): U {

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
