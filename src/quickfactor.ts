import { bignum_power_number, bignum_truncate } from './bignum';
import { ExtensionEnv } from './env/ExtensionEnv';
import { factor_small_number } from './factor';
import { makeList } from './makeList';
import { multiply_items } from './multiply';
import { nativeInt } from './nativeInt';
import { POWER } from './runtime/constants';
import { Rat } from './tree/rat/Rat';
import { U } from './tree/tree';

//-----------------------------------------------------------------------------
//
//  Factor small numerical powers
//
//  Input:    BASE        Base (positive integer < 2^31 - 1)
//            EXPONENT    Exponent
//
//  Output:    Expr
//
//-----------------------------------------------------------------------------
export function quickfactor(BASE: Rat, EXPO: Rat, $: ExtensionEnv): U {
  const rats = factor_small_number(nativeInt(BASE));
  const arr: U[] = rats;
  const n = arr.length;

  for (let i = 0; i < n; i += 2) {
    // In fact, why use $.multiply when we only have Rat(s)?
    // We may also be able to prove that this function returns a Rat.
    arr.push(...quickpower(rats[i], $.multiply(arr[i + 1], EXPO) as Rat, $)); // factored base, factored exponent * EXPO
  }

  // arr0 has n results from factor_number_raw()
  // on top of that are all the expressions from quickpower()
  // multiply the quickpower() results
  return multiply_items(arr.slice(n), $);
}

// BASE is a prime number so power is simpler
export function quickpower(BASE: Rat, EXPO: Rat, $: ExtensionEnv): [U] | [U, U] {
  const p3 = bignum_truncate(EXPO);
  const p4 = $.subtract(EXPO, p3);

  let fractionalPart: U | undefined;
  // fractional part of EXPO
  if (!$.isZero(p4)) {
    fractionalPart = makeList(POWER, BASE, p4);
  }

  const expo = nativeInt(p3);
  if (isNaN(expo)) {
    const result = makeList(POWER, BASE, p3);
    return fractionalPart ? [fractionalPart, result] : [result];
  }

  if (expo === 0) {
    return [fractionalPart as U];
  }

  const result = bignum_power_number(BASE, expo);
  return fractionalPart ? [fractionalPart, result] : [result];
}

//if SELFTEST
