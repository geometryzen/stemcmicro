import { assert } from "chai";
import { create_script_context, ScriptContextOptions } from "../index";
import { ScriptKind } from "../src/parser/parser";

describe("example", function () {
    it("Geometric Algebra", function () {
        const lines: string[] = [
            `G30=algebra([1,1,1],["i","j","k"])`,
            `e1=G30[1]`,
            `e2=G30[2]`,
            `e3=G30[3]`,
            `grad(s) = d(s,x) * e1 + d(s,y) * e2 + d(s,z) * e3`,
            `div(v) = d(v|e1,x) + d(v|e2,y) + d(v|e3,z)`,
            `curl(v) = (d(v|e3,y)-d(v|e2,z))*e1+(d(v|e1,z)-d(v|e3,x))*e2+(d(v|e2,x)-d(v|e1,y))*e3`,
            `ddrv(v,a) = (a|e1)*d(v,x)+(a|e2)*d(v,y)+(a|e3)*d(v,z)`,
            `A = Ax * e1 + Ay * e2 + Az * e3`,
            `B = Bx * e1 + By * e2 + Bz * e3`,
            `C = Cx * e1 + Cy * e2 + Cz * e3`,
            `cross(A,B)`,
            `A|B`,
            `A^B`
        ];
        const sourcetText = lines.join('\n');
        const options: ScriptContextOptions = {
            scriptKind: ScriptKind.BRITE,
            useCaretForExponentiation: false,
            useDefinitions: false
        };
        const context = create_script_context(options);
        const { values } = context.executeScript(sourcetText);
        assert.strictEqual(context.renderAsInfix(values[0]), "Ay*Bz*i-Az*By*i-Ax*Bz*j+Az*Bx*j+Ax*By*k-Ay*Bx*k");
        assert.strictEqual(context.renderAsInfix(values[1]), "Ax*Bx+Ay*By+Az*Bz");
        assert.strictEqual(context.renderAsInfix(values[2]), "Ax*By*i^j-Ay*Bx*i^j+Ax*Bz*i^k-Az*Bx*i^k+Ay*Bz*j^k-Az*By*j^k");
        context.release();
    });
});
