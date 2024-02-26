import { Err } from "math-expression-atoms";
import { is_nil, U } from "math-expression-tree";

/**
 * 
 */
export function hook_create_err(cause: U, pos?: number, end?: number): Err {
    // nil is used typicsall for determining the type property of an Err dynamically, so we'll ignore these. 
    if (!is_nil(cause)) {
        // console.lg(new Error().stack);
        // eslint-disable-next-line no-console
        // console.lg("hook_create_err", `${cause}`);
    }
    // TODO: There is no create_err function in atoms. That would be good.
    return new Err(cause, pos, end);
}