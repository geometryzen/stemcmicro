import { assert } from "chai";
import { create_script_context } from "../src/runtime/script_engine";

describe("eigenvec", function () {
    it("A", function () {
        const lines: string[] = [
            `A=[[1,2,3],[2,6,4],[3,4,5]]`,
            `Q=eigenvec(A)`,
            `Q`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0.871597...,0.032292...,-0.489158...],[0.338150...,0.682834...,0.647605...],[0.354926...,-0.729860...,0.584237...]]");
        engine.release();
    });
    it("B", function () {
        const lines: string[] = [
            `A=[[1,2,3],[2,6,4],[3,4,5]]`,
            `Q=eigenvec(A)`,
            `transpose(Q)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0.871597...,0.338150...,0.354926...],[0.032292...,0.682834...,-0.729860...],[-0.489158...,0.647605...,0.584237...]]");
        engine.release();
    });
    it("C", function () {
        const lines: string[] = [
            `A=[[1,2,3],[2,6,4],[3,4,5]]`,
            `Q=eigenvec(A)`,
            `D=dot(transpose(Q),A,Q)`,
            `dot(Q,D,transpose(Q))`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[1.000000...,2.000000...,3.000000...],[2.000000...,6.000000...,4.000000...],[3.000000...,4.000000...,5.000000...]]");
        engine.release();
    });
});
