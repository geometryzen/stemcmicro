import { ExtensionEnv } from '../../env/ExtensionEnv';
import { guess } from '../../guess';
import { nativeInt } from '../../nativeInt';
import { car, cdr, Cons, nil, U } from '../../tree/tree';
import { integral } from '../integral/integral_helpers';
import { is_num } from '../num/is_num';
import { derivative } from './derivative';

export function eval_derivative(expr: Cons, $: ExtensionEnv): U {
    // eslint-disable-next-line no-console
    // console.lg(`car(expr.cdr)=${render_as_sexpr(car(expr.cdr), $)})`);
    // evaluate 1st arg to get function F
    let F = $.valueOf(car(expr.cdr));

    // evaluate 2nd arg and then...

    // example   result of 2nd arg  what to do
    // -------   -----------------  ---------------
    // d(f)      NIL                guess X, N = NIL
    // d(f,2)    2                  guess X, N = 2
    // d(f,x)    x                  X = x, N = NIL
    // d(f,x,2)  x                  X = x, N = 2
    // d(f,x,y)  x                  X = x, N = y

    let p1 = cdr(expr.cdr);

    let X: U, N: U;
    const p2 = $.valueOf(car(p1));
    if (nil.equals(p2)) {
        X = guess(F);
        N = nil;
    }
    else if (is_num(p2)) {
        X = guess(F);
        N = p2;
    }
    else {
        X = p2;
        p1 = cdr(p1);
        N = $.valueOf(car(p1));
    }
    // console.lg(`F=${render_as_sexpr(F, $)}`);
    // console.lg(`X=${render_as_sexpr(X, $)}`);
    // console.lg(`p1=${render_as_sexpr(p1, $)}`);
    // console.lg(`p2=${render_as_sexpr(p2, $)}`);
    // console.lg(`N=${render_as_sexpr(N, $)}`);

    // eslint-disable-next-line no-constant-condition
    while (true) {
        // p5 (N) might be a symbol instead of a number
        let n: number;
        if (is_num(N)) {
            n = nativeInt(N);
            if (isNaN(n)) {
                throw new Error('nth derivative: check n');
            }
        }
        else {
            n = 1;
        }

        let temp = F;
        if (n >= 0) {
            for (let i = 0; i < n; i++) {
                temp = derivative(temp, X, $);
            }
        }
        else {
            n = -n;
            for (let i = 0; i < n; i++) {
                temp = integral(temp, X, $);
            }
        }

        F = temp;

        // if p5 (N) is NIL then arglist is exhausted
        if (N.isnil) {
            break;
        }

        // otherwise...

        // N    arg1    what to do
        //
        // number  NIL    break
        // number  number    N = arg1, continue
        // number  symbol    X = arg1, N = arg2, continue
        //
        // symbol  NIL    X = N, N = NIL, continue
        // symbol  number    X = N, N = arg1, continue
        // symbol  symbol    X = N, N = arg1, continue

        if (is_num(N)) {
            p1 = cdr(p1);
            N = $.valueOf(car(p1));
            if (N.isnil) {
                break; // arglist exhausted
            }
            if (!is_num(N)) {
                X = N;
                p1 = cdr(p1);
                N = $.valueOf(car(p1));
            }
        }
        else {
            X = N;
            p1 = cdr(p1);
            N = $.valueOf(car(p1));
        }
    }
    return F;
}
