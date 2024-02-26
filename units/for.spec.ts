import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("for", function () {
    // TODO: Find out why this is running slowly.
    xit("compute pi to six digits using Viete's formula ( see http://www.pi314.net/eng/viete.php )", function () {
        const lines: string[] = [
            `x=0`,
            `y=2`,
            `for(do(x=sqrt(2+x),y=2*y/x), k,1,9)`,
            `float(y)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_context({});
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "3.141588...");
        }
        engine.release();
    });
});
