import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { is_sym } from './operators/sym/is_sym';
import { EVAL, FUNCTION } from './runtime/constants';
import { halt } from './runtime/defs';
import { stack_push } from './runtime/stack';
import { caadr, caddr, cadr, cdadr } from './tree/helpers';
import { car, NIL, U } from './tree/tree';

// Store a function definition
//
// Example:
//
//      f(x,y)=x^y
//
// For this definition, p1 points to the following structure.
//
//     p1
//      |
//   ___v__    ______                        ______
//  |CONS  |->|CONS  |--------------------->|CONS  |
//  |______|  |______|                      |______|
//      |         |                             |
//   ___v__    ___v__    ______    ______    ___v__    ______    ______
//  |SETQ  |  |CONS  |->|CONS  |->|CONS  |  |CONS  |->|CONS  |->|CONS  |
//  |______|  |______|  |______|  |______|  |______|  |______|  |______|
//                |         |         |         |         |         |
//             ___v__    ___v__    ___v__    ___v__    ___v__    ___v__
//            |SYM f |  |SYM x |  |SYM y |  |POWER |  |SYM x |  |SYM y |
//            |______|  |______|  |______|  |______|  |______|  |______|
//
// the result (in f) is a FUNCTION node
// that contains both the body and the argument list.
//
// We have
//
//  caadr(p1) points to the function name i.e. f
//  cdadr(p1) points to the arguments i.e. the list (x y)
//  caddr(p1) points to the function body i.e. (power x y)
// F function name
// A argument list
// B function body
export function define_user_function(p1: U, $: ExtensionEnv): void {
    const F = caadr(p1);
    const A = cdadr(p1);
    let B = caddr(p1);

    if (!is_sym(F)) {
        halt('function name?');
    }

    // evaluate function body (maybe)

    if (car(B) === EVAL) {
        B = $.valueOf(cadr(B));
    }

    // note how, unless explicitly forced by an eval,
    // (handled by the if just above)
    // we don't eval/simplify
    // the body.
    // Why? because it's the easiest way
    // to solve scope problems i.e.
    //   x = 0
    //   f(x) = x + 1
    //   f(4) # would reply 1
    // which would need to otherwise
    // be solved by some scope device
    // somehow
    B = makeList(FUNCTION, B, A);

    $.setBinding(F, B);

    stack_push(NIL);
}

export function Eval_function_reference(p1: U) {
    stack_push(p1);
}
