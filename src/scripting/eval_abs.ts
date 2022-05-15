import { ExtensionEnv } from '../env/ExtensionEnv';
import { abs } from '../operators/abs/abs';
import { stack_push } from '../runtime/stack';
import { car, Cons } from '../tree/tree';

//(docs are generated from top-level comments, keep an eye on the formatting!)

/* abs =====================================================================

Tags
----
scripting, JS, internal, treenode, general concept

Parameters
----------
x

General description
-------------------
Returns the absolute value of a real number, the magnitude of a complex number, or the vector length.

*/

/*
 Absolute value of a number,or magnitude of complex z, or norm of a vector

  z    abs(z)
  -    ------

  a    a

  -a    a

  (-1)^a    1

  exp(a + i b)  exp(a)

  a b    abs(a) abs(b)

  a + i b    sqrt(a^2 + b^2)

Notes

  1. Handles mixed polar and rectangular forms, e.g. 1 + exp(i pi/3)

  2. jean-francois.debroux reports that when z=(a+i*b)/(c+i*d) then

    abs(numerator(z)) / abs(denominator(z))

     must be used to get the correct answer. Now the operation is
     automatic.
*/

export function Eval_abs(expr: Cons, $: ExtensionEnv): void {

    const argList = expr.cdr;
    const arg = car(argList);
    const x = $.valueOf(arg);
    const result = abs(x, $);
    stack_push(result);
}
