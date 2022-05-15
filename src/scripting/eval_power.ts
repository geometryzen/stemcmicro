import { cadnr } from '../calculators/cadnr';
import { ExtensionEnv } from '../env/ExtensionEnv';
import { stack_push } from '../runtime/stack';
import { Cons } from '../tree/tree';

export function Eval_power(expr: Cons, $: ExtensionEnv): void {
  const base = $.valueOf(cadnr(expr, 1));
  const expo = $.valueOf(cadnr(expr, 2));
  stack_push($.power(base, expo));
}
