import { cons, nil, U } from '../tree/tree';
import { defs } from './defs';
import { SystemError } from './SystemError';

//   _______
//  |  | <- stack
//  |  |
//  |_______|
//  |  | <- stack + tos
//  |  |
//  |  |
//  |_______|
//  |  | <- frame
//  |_______|
//      <- stack + TOS
//
//  The stack grows from low memory towards high memory. This is so that
//  multiple expressions can be pushed on the stack and then accessed as an
//  array.
//
//  The frame area holds local variables and grows from high memory towards
//  low memory. The frame area makes local variables visible to the garIIIbage
//  collector.

/**
 * Push onto the stack.
 * @param expr The value to push onto the stack.
 */
export function stack_push(expr: U): void {
    // console.lg(`push(${expr})`);
    if (typeof expr === 'undefined') {
        throw new Error('expr must be defined.');
    }
    defs.stack[defs.tos++] = expr;
}

export function stack_pop(): U {
    if (defs.tos === 0) {
        throw new SystemError('stack underflow');
    }
    const popped = defs.stack[--defs.tos];
    defs.stack[defs.tos] = null;
    // No need to do any reference counting stuff if it is a symbol because the receiver
    // of the return value now owns the thing.
    // console.lg(`pop ${popped}`);
    return popped as U;
}

/**
 * Temporary function to push an array of items onto the stack.
 * Useful when migrating a function to returning a U[], but its
 * caller still needs the items on the stack
 *
 * WARNING!!! Destructive because the function producing the array is producing
 * a new array that will either be used as expected or pushed onto
 * the stack for compatibilty
 *
 * TODO: Delete when all functions are transitioned over to
 * normal arguments and outputs rather than using the stack
 *
 * Remaining Use: factorpoly.ts
 */
export function stack_push_items(items: U[]): void {
    while (items.length > 0) {
        stack_push(items.shift() as U);
    }
}

/**
 * Returns the top of the program stack without actually popping it.
 */
export function stack_peek(): U {
    // All this casting is making me queasy.
    return defs.stack[defs.tos - 1] as U;
}
