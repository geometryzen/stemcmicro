import { Err } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";

/**
 * A hook to allow the inspection of errors as they are created.
 */
export function hook_create_err(message: U, pos?: number, end?: number, cause?: Err): Err {
    // nil is used typicsall for determining the type property of an Err dynamically, so we'll ignore these.
    if (!is_nil(message)) {
        // console.lg(new Error().stack);
        // eslint-disable-next-line no-console
        // console.lg("hook_create_err", `${cause}`);
    }
    return new Err(message, cause, pos, end);
}
