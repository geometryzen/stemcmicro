import { U } from "@stemcmicro/tree";

export class Defs {
    constructor() {
        // Nothing to see here yet.
    }

    /**
     * top of stack
     */
    public tos = 0;

    /**
     * The program execution stack.
     * TODO: This should be moved to the $ to achieve isolation of executions.
     * It should also not allow undefined and null values as this requires casting elsewhere.
     * Encapsulation with assertion may help.
     */
    public stack: (U | undefined | null)[] = [];
}

/**
 * Global (singleton) instance of Defs.
 */
export const defs = new Defs();

export function move_top_of_stack(stackPos: number) {
    if (defs.tos <= stackPos) {
        // we are moving the stack pointer
        // "up" the stack (as if we were doing a push)
        defs.tos = stackPos;
        return;
    }
    // we are moving the stack pointer
    // "down" the stack i.e. as if we were
    // doing a pop, we can zero-
    // out all the elements that we pass
    // so we can reclaim the memory
    while (defs.tos > stackPos) {
        defs.stack[defs.tos] = null;
        defs.tos--;
    }
}
