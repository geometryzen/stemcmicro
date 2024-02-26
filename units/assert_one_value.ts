import assert from 'assert';
import { U } from 'math-expression-tree';
/**
 * A useful function for diagnosing problems.
 * Use in conjunction with the execute function.
 */
export function assert_one_value(retval: { value: U, errors: Error[] }): U {
    if (retval.errors.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(retval.errors[0].stack);
        assert.fail(`You've got errors! errors => ${retval.errors}`);
    }
    else {
        if (retval.value) {
            return retval.value;
        }
        else {
            assert.fail(`Expecting a single value but got nothing. errors => ${retval.errors}`);
        }
    }
}
