import { Sign } from '../env/ExtensionEnv';
import { BigInteger } from '../tree/rat/big-integer';
// Bignum compare
//  returns
//  -1    a < b
//  0    a = b
//  1    a > b
export function mcmp(a: BigInteger, b: BigInteger): Sign {
    return a.compare(b) as Sign;
}

// a is a bigint, n is a normal int
/*
function mcmpint(a: BigInteger, n: number): Sign {
  const b = bigInt(n);
  const t = mcmp(a, b);
  return t;
}
*/
