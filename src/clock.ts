import { abs } from './operators/abs/abs';
import { ExtensionEnv } from './env/ExtensionEnv';
import { makeList } from './makeList';
import { POWER } from './runtime/constants';
import { DynamicConstants } from './runtime/defs';
import { negOne } from './tree/rat/Rat';
import { U } from './tree/tree';

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

export function clockform(z: U, $: ExtensionEnv): U {
    // pushing the expression (-1)^... but note
    // that we can't use "power", as "power" evaluates
    // clock forms into rectangular form (see "-1 ^ rational"
    // section in power)
    const l = makeList(POWER, negOne, $.divide($.arg(z), DynamicConstants.Pi()));
    return $.multiply(abs(z, $), l);
}
