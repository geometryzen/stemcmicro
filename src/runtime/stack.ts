import { U } from '../tree/tree';
import { defs } from './defs';
import { SystemError } from './SystemError';

/**
 * @deprecated
 */
export function stack_push(expr: U): void {
    // console.lg(`push(${expr})`);
    if (typeof expr === 'undefined') {
        throw new Error('expr must be defined.');
    }
    defs.stack[defs.tos++] = expr;
}

/**
 * @deprecated
 */
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
 * @deprecated
 */
export function stack_push_items(items: U[]): void {
    while (items.length > 0) {
        stack_push(items.shift() as U);
    }
}
