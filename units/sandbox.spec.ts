import { assert } from "chai";
import { create_script_engine } from "../src/runtime/script_engine";

describe("sandbox", function () {
    xit("???", function () {
        const lines: string[] = [
            `do(x=sqrt(2+x),y=2*y/x)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useDefinitions: false });
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "for(body,k,1,iterations)");
        }
        engine.release();
    });
    xit("???", function () {
        const lines: string[] = [
            `body=do(x=sqrt(2+x),y=2*y/x)`,
            `for(body,k,1,iterations)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useDefinitions: false });
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "for(body,k,1,iterations)");
        }
        engine.release();
    });
    xit("???", function () {
        const lines: string[] = [
            `for(do(x=sqrt(2+x),y=2*y/x),k,1,iterations)`
        ];
        const sourceText = lines.join('\n');
        const engine = create_script_engine({ useDefinitions: false });
        const { values, errors } = engine.executeScript(sourceText);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const error of errors) {
            // eslint-disable-next-line no-console
            // console.lg("error", error);
        }
        for (const value of values) {
            assert.strictEqual(engine.renderAsInfix(value), "for(do(x=sqrt(2+x),y=2*y/x),k,1,iterations)");
        }
        engine.release();
    });
});
