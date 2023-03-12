import { Cons, items_to_cons as f, U } from './tree/tree';

/**
 *
 */
export function items_to_cons(...items: U[]): Cons {
    return f(...items);
}
