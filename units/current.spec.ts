import { assert } from "chai";
import { NOFLAGS, PHASE_EXPANDING, PHASE_EXPLICATE, PHASE_FACTORING, PHASE_IMPLICATE } from "../src/env/ExtensionEnv";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("current", function () {
    xit("A x (B x C)", function () {
        //
        // Looping?
        const lines: string[] = [
            `G = algebra([1,1,1],["i","j","k"])`,
            `e1=G[1]`,
            `e2=G[2]`,
            `e3=G[3]`,
            `A = e1 * Ax + e2 * Ay + e3 * Az`,
            `B = e1 * Bx + e2 * By + e3 * Bz`,
            `C = e1 * Cx + e2 * Cy + e3 * Cz`,
            `cross(A,cross(B,C))`
        ];
        const engine = createSymEngine({
            dependencies: ['Blade']
        });
        const $ = engine.$;
        const value = assert_one_value_execute(lines.join('\n'), engine);
        // assert.strictEqual(print_list(value,$), "");
        assert.strictEqual(print_expr(value, $), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");

        let tree = value;

        tree.reset(NOFLAGS);
        engine.$.setPhase(PHASE_EXPLICATE);
        tree = $.valueOf(tree);

        // TODO: How to guide the transformations?

        tree.reset(NOFLAGS);
        engine.$.setPhase(PHASE_EXPANDING);
        tree = $.valueOf(tree);

        tree.reset(NOFLAGS);
        engine.$.setPhase(PHASE_FACTORING);
        tree = $.valueOf(tree);

        tree.reset(NOFLAGS);
        engine.$.setPhase(PHASE_IMPLICATE);
        tree = $.valueOf(tree);

        // We are back to where we started.
        // TODO: Now we should attempt to guide the transformation in different directions.
        assert.strictEqual(print_expr(value, $), "(Ay*Bx*Cy-Ay*By*Cx+Az*Bx*Cz-Az*Bz*Cx)*i+(-Ax*Bx*Cy+Ax*By*Cx+Az*By*Cz-Az*Bz*Cy)*j+(-Ax*Bx*Cz+Ax*Bz*Cx-Ay*By*Cz+Ay*Bz*Cy)*k");

        engine.release();
    });
});
