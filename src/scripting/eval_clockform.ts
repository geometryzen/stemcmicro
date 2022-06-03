import { clockform } from '../operators/clock/clock';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { cadr } from '../tree/helpers';
import { U } from '../tree/tree';

/*
 Convert complex z to clock form

  Input:    push  z

  Output:    Result on stack

  clock(z) = abs(z) * (-1) ^ (arg(z) / pi)

  For example, clock(exp(i pi/3)) gives the result (-1)^(1/3)
*/

// P.S. I couldn't find independent definition/aknowledgment
// of the naming "clock form" anywhere on the web, seems like a
// naming specific to eigenmath.
// Clock form is another way to express a complex number, and
// it has three advantages
//   1) it's uniform with how for example
//      i is expressed i.e. (-1)^(1/2)
//   2) it's very compact
//   3) it's a straighforward notation for roots of 1 and -1

export function Eval_clockform(p1: U, $: ExtensionEnv): U {
    const result = clockform($.valueOf(cadr(p1)), $);
    return result;
}
