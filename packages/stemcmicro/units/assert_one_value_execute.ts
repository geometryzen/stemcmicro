import assert from "assert";
import { U } from "@stemcmicro/tree";
import { ScriptContext, ScriptExecuteOptions } from "../src/runtime/script_engine";
import { assert_one_value } from "./assert_one_value";

/**
 * Convenience function for executing the script and then asserting one value.
 */
export function assert_one_value_execute(sourceText: string, context: ScriptContext, options?: ScriptExecuteOptions): U {
    const data = context.executeScript(sourceText, options);
    if (Array.isArray(data.values)) {
        return assert_one_value({ value: data.values[0], errors: data.errors });
    } else {
        assert.fail(`Expecting a single value but got nothing. errors => ${data.errors}`);
    }
}
