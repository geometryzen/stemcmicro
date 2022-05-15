import { ExtensionEnv } from './env/ExtensionEnv';
import { yyfloat } from './operators/float/float';
import { is_rat_integer } from './is_rat_integer';
import { makeList } from './makeList';
import { ROUND } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { is_num } from './predicates/is_num';
import { flt, Flt } from './tree/flt/Flt';
import { is_flt } from './tree/flt/is_flt';
import { cadr } from './tree/helpers';
import { integer } from './tree/rat/Rat';
import { U } from './tree/tree';

export function Eval_round(p1: U, $: ExtensionEnv): void {
  const result = yround($.valueOf(cadr(p1)), $);
  stack_push(result);
}

function yround(expr: U, $: ExtensionEnv): U {
  if (!is_num(expr)) {
    return makeList(ROUND, expr);
  }

  if (is_flt(expr)) {
    return flt(Math.round(expr.d));
  }

  if (is_rat_integer(expr)) {
    return expr;
  }

  // TODO: Eliminate the cast.
  const retval = yyfloat(expr, $) as Flt;
  return integer(Math.round(retval.d));
}
