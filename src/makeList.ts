import { cons, Cons, NIL, U } from './tree/tree';

/**
 * TODO: Could probably live with the tree stuff.
 */
export function makeList(...items: U[]): Cons {
    let node: Cons = NIL;
    // Iterate in reverse order so that we build up a NIL-terminated list from the right (NIL).
    for (let i = items.length - 1; i >= 0; i--) {
        node = cons(items[i], node);
    }
    return node;
}
