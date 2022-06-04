import { scan } from "../scanner/scan";
import { Err } from "../tree/err/Err";
import { wrap_as_flt } from "../tree/flt/Flt";
import { wrap_as_int } from "../tree/rat/Rat";
import { U } from "../tree/tree";
import { stack_push } from "./stack";

/**
 * Parse the input and push it onto the stack.
 * @param input 
 */
export function zombo_parse(input: string | number | U): void {
    if (typeof input === 'string') {
        const [scanned, tree] = scan(input, { useCaretForExponentiation: false });
        if (scanned > 0) {
            stack_push(tree);
        }
        else {
            stack_push(new Err("Something is rotten in Zombo"));
        }
    }
    else if (typeof input === 'number') {
        if (input % 1 === 0) {
            stack_push(wrap_as_int(input));
        }
        else {
            stack_push(wrap_as_flt(input));
        }
    }
    else {
        stack_push(input);
    }
}