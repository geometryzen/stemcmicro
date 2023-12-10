import { BigInteger, gcd } from './tree/rat/big-integer';

//-----------------------------------------------------------------------------
//
//  Bignum GCD
//
//  Uses the binary GCD algorithm.
//
//  See "The Art of Computer Programming" p. 338.
//
//  mgcd always returns a positive value
//
//  mgcd(0, 0) = 0
//
//  mgcd(u, 0) = |u|
//
//  mgcd(0, v) = |v|
//
//-----------------------------------------------------------------------------
export function mgcd(u: BigInteger, v: BigInteger): BigInteger {
    return gcd(u, v);
}
