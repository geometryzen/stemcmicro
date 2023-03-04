import { ExtensionEnv } from '../../env/ExtensionEnv';
import { makeList } from '../../makeList';
import { EVAL, FUNCTION } from '../../runtime/constants';
import { halt } from '../../runtime/defs';
import { caadr, caddr, cadr, cdadr } from '../../tree/helpers';
import { Sym } from '../../tree/sym/Sym';
import { car, nil, U } from '../../tree/tree';
import { BCons } from '../helpers/BCons';
import { is_sym } from '../sym/is_sym';

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
//  caddr(p1) points to the function body i.e. (expt x y)
// F function name
// A argument list
// B function body
/**
 * The assignment is converted info a binding of f to (function body argList).
 * 
 * @param p1 (= (f argList) body)
 */
export function define_user_function(p1: BCons<Sym, U, U>, $: ExtensionEnv): U {
    // console.lg(`define_user_function ${print_list(p1, $)}`);
    /**
     * The function name.
     */
    const F = caadr(p1);
    /**
     * The argument list.
     */
    const A = cdadr(p1);
    /**
     * The function body.
     */
    let B = caddr(p1);

    // console.lg(`F => ${F}`);
    // console.lg(`A => ${A}`);
    // console.lg(`B => ${B}`);

    if (!is_sym(F)) {
        halt('function name?');
    }

    // evaluate function body (maybe)

    if (car(B).equals(EVAL)) {
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

    return nil;
}
