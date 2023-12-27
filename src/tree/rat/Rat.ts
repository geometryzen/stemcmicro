import { RBTree } from 'generic-rbtree';
import { Rat } from 'math-expression-atoms';
import { bigInt } from '../rat/big-integer';

//
// Our goal is to try to encapsulate the bigInt dependency so that no consumers of the Rat
// are aware of this dependency. Additionally we don't want the Rat to have dependencies
// so that it can be broken off into a standalone library.
//
// big-integer provides support for arbitrary size integers.
// generic-rbtree provides support for a cache of integers to take the load off the Garbage Collector.
//
/*
function MLENGTH(p: BigInteger): number {
    return p.toString().length;
}
*/

export { Rat };

interface Comparator<K> {
    (a: K, b: K): (-1 | 1 | 0);
}

const numberComparator: Comparator<number> = function (x: number, y: number) {
    if (x < y) {
        return -1;
    }
    if (x > y) {
        return 1;
    }
    return 0;
};

const lBound = -128 - 1;
const uBound = 127 + 1;
const nilValue = new Rat(bigInt(lBound), bigInt.one);
const cache: RBTree<number, Rat> = new RBTree<number, Rat>(lBound, uBound, nilValue, numberComparator);

for (let n = lBound + 1; n < uBound; n++) {
    cache.insert(n, new Rat(bigInt(n), bigInt.one));
}

/**
 * Constructor function for Num from integer which is a primitive number.
 */
export function create_int(n: number, pos?: number, end?: number): Rat {
    if (n < uBound && n > lBound) {
        return cache.search(n);
    }
    else {
        return new Rat(bigInt(n), bigInt.one, pos, end);
    }
}

export function create_rat(numer: number, denom: number, pos?: number, end?: number): Rat {
    // console.lg("wrap_as_rat", numer, denom);
    return new Rat(bigInt(numer), bigInt(denom), pos, end);
}

/**
 * The canonical representation of the identity element for ordinary multiplication. 
 */
export const one = new Rat(bigInt(1), bigInt.one);
export const two = new Rat(bigInt(2), bigInt.one);
export const three = new Rat(bigInt(3), bigInt.one);
export const four = new Rat(bigInt(4), bigInt.one);
export const five = new Rat(bigInt(5), bigInt.one);
export const six = new Rat(bigInt(6), bigInt.one);
export const seven = new Rat(bigInt(7), bigInt.one);
export const eight = new Rat(bigInt(8), bigInt.one);
export const nine = new Rat(bigInt(9), bigInt.one);
export const ten = new Rat(bigInt(10), bigInt.one);
export const eleven = new Rat(bigInt(11), bigInt.one);
export const negOne = one.neg();
export const negTwo = two.neg();
export const negThree = three.neg();
export const negFour = four.neg();
export const negFive = five.neg();
export const negSix = six.neg();
export const negSeven = seven.neg();
export const negEight = eight.neg();
export const negNine = nine.neg();
export const negTen = ten.neg();
export const negEleven = eleven.neg();
/**
 * The canonical representation of the identity element for ordinary addition. 
 */
export const zero = new Rat(bigInt(0), bigInt.one);
export const half = new Rat(bigInt(1), bigInt(2));
export const negHalf = half.neg();
export const third = new Rat(bigInt(1), bigInt(3));
