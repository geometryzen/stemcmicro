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

/**
 * Temporary function to get n items off the stack at runtime.
 *
 * TODO: Delete when all functions are transitioned over to
 * normal arguments and outputs rather than using the stack
 *
 * Remaining Use: list.ts, multiply.ts
 */
export function stack_pop_items(n: number): U[] {
    const items: U[] = [];
    for (let i = 0; i < n; i++) {
        items.push(stack_pop());
    }
    return items;
}

/**
 * Create a list from n things on the stack.
 * The list will have the nested Cons structure.
 * The list will be NIL-terminated.
 * The lowest item on the stack will be the first in the list.
 * The highest item on the stack will be the last in the list.
 * The result is stored on the top of the stack. 
 * 
 * @param n is an integer.
 * @param $ the environment is required to provide the NIL symbol.
 */
export function stack_list(n: number): void {
    stack_push(nil);
    for (let i = 0; i < n; i++) {
        const arg2 = stack_pop();
        const arg1 = stack_pop();
        stack_push(cons(arg1, arg2));
    }
}

/**
 * Changes the order of the top two elements on the stack.
 */
export function stack_swap(): void {
    const p = stack_pop();
    const q = stack_pop();
    stack_push(p);
    stack_push(q);
}

class Stack {
    push(expr: U): void {
        stack_push(expr);
    }
    pop(): U {
        return stack_pop();
    }
    peek(): U {
        return stack_peek();
    }
    pushItems(items: U[]): void {
        stack_push_items(items);
    }
    popItems(n: number): U[] {
        return stack_pop_items(n);
    }
    list(n: number): void {
        stack_list(n);
    }
    swap(): void {
        stack_swap();
    }
}

export const gStack = new Stack();
