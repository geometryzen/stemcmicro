import { assert } from 'chai';
import { Engine } from "../src/runtime/symengine";
import { U } from "../src/tree/tree";
import { assert_one_value } from "./assert_one_value";

/**
 * Convenience function for executing the script and then asserting one value.
 */
export function assert_one_value_execute(script: string, engine: Engine): U {
    const data = engine.executeScript(script);
    if (data.values) {
        return assert_one_value({ value: data.values[0], errors: data.errors });
    }
    else {
        assert.fail(`Expecting a single value but got nothing. errors => ${data.errors}`);
    }
}