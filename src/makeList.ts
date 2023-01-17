import { Cons, items_to_cons, U } from './tree/tree';

/**
 * @deprecated Use items_to_cons instead.
 */
export function makeList(...items: U[]): Cons {
    return items_to_cons(...items);
    /*
    let node: Cons = nil;
    // Iterate in reverse order so that we build up a NIL-terminated list from the right (NIL).
    for (let i = items.length - 1; i >= 0; i--) {
        node = cons(items[i], node);
    }
    return node;
    */
}
