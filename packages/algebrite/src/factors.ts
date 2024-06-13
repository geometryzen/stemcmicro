import { is_add, is_multiply } from "@stemcmicro/helpers";
import { U } from "@stemcmicro/tree";

// Push expression factors onto the stack. For example...
//
// Input
//
//       2
//     3x  + 2x + 1
//
// Output on stack
//
//     [  3  ]
//     [ x^2 ]
//     [  2  ]
//     [  x  ]
//     [  1  ]
//

// but not necessarily in that order. Returns the number of factors.
export function factors(p: U): U[] {
    const result: U[] = [];
    if (is_add(p)) {
        p.tail().forEach((el) => result.push(...term_factors(el)));
    } else {
        result.push(...term_factors(p));
    }
    return result;
}

function term_factors(p: U): U[] {
    if (is_multiply(p)) {
        return p.tail();
    }
    return [p];
}
