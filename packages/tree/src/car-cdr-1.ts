import { Cons, is_cons, nil, U } from "./tree";

/**
 * Returns the car property of the tree node if it is a Cons.
 * Otherwise, returns nil.
 * The returned item is reference counted.
 */
export function car(node: U): U {
    if (is_cons(node)) {
        return node.car;
    } else {
        return nil;
    }
}

/**
 * Returns the cdr property of the tree node if it is a Cons.
 * Otherwise, returns nil.
 * The returned item is reference counted.
 */
export function cdr(node: U): Cons {
    if (is_cons(node)) {
        return node.cdr;
    } else {
        return nil;
    }
}
