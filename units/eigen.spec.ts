import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";

describe("eigen", function () {
    it("eigenval(A)", function () {
        const lines: string[] = [
            `eigenval(A)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "eigenval(A)");
        engine.release();
    });
    it("eigenvec(A)", function () {
        const lines: string[] = [
            `eigenvec(A)`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "eigenvec(A)");
        engine.release();
    });
    it("eigenval([[1,1,1,1],[1,2,3,4],[1,3,6,10],[1,4,10,20]])", function () {
        const lines: string[] = [
            `eigenval([[1,1,1,1],[1,2,3,4],[1,3,6,10],[1,4,10,20]])`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0.038016...,0.0,0.0,0.0],[0.0,0.453835...,0.0,0.0],[0.0,0.0,2.203446...,0.0],[0.0,0.0,0.0,26.304703...]]");
        engine.release();
    });
    it("eigenvec([[1,1,1,1],[1,2,3,4],[1,3,6,10],[1,4,10,20]])", function () {
        const lines: string[] = [
            `eigenvec([[1,1,1,1],[1,2,3,4],[1,3,6,10],[1,4,10,20]])`
        ];
        const engine = create_script_context({
        });
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(engine.renderAsInfix(values[0]), "[[0.308686...,-0.723090...,0.594551...,-0.168412...],[0.787275...,-0.163234...,-0.532107...,0.265358...],[0.530366...,0.640332...,0.391832...,-0.393897...],[0.060187...,0.201173...,0.458082...,0.863752...]]");
        engine.release();
    });
});
