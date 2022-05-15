import { coeff } from './coeff';
import { ExtensionEnv } from './env/ExtensionEnv';
import { SYMBOL_X } from './runtime/constants';
import { stack_push } from './runtime/stack';
import { cadddr, caddr, cadr } from './tree/helpers';
import { integer, zero } from './tree/rat/Rat';
import { NIL, U } from './tree/tree';

// Divide polynomials
export function Eval_quotient(p1: U, $: ExtensionEnv): void {
  const DIVIDEND = $.valueOf(cadr(p1)); // 1st arg, p(x)
  const DIVISOR = $.valueOf(caddr(p1)); // 2nd arg, q(x)
  const X = $.valueOf(cadddr(p1)); // 3rd arg, x, default x
  if (NIL !== X) {
    stack_push(divpoly(DIVIDEND, DIVISOR, X, $));
  }
  else {
    stack_push(divpoly(DIVIDEND, DIVISOR, SYMBOL_X, $));
  }
}

//-----------------------------------------------------------------------------
//
//  Divide polynomials
//
//  Input:    Dividend
//            Divisor
//            x
//
//  Output:    Quotient
//
//-----------------------------------------------------------------------------
export function divpoly(DIVIDEND: U, DIVISOR: U, X: U, $: ExtensionEnv): U {
  const dividendCs = coeff(DIVIDEND, X, $);
  let m = dividendCs.length - 1; // m is dividend's power

  const divisorCs = coeff(DIVISOR, X, $);
  const n = divisorCs.length - 1; // n is divisor's power

  let x = m - n;

  let QUOTIENT: U = zero;
  while (x >= 0) {
    const Q = $.divide(dividendCs[m], divisorCs[n]);

    for (let i = 0; i <= n; i++) {
      dividendCs[x + i] = $.subtract(dividendCs[x + i], $.multiply(divisorCs[i], Q));
    }

    QUOTIENT = $.add(QUOTIENT, $.multiply(Q, $.power(X, integer(x))));

    m--;
    x--;
  }

  return QUOTIENT;
}
