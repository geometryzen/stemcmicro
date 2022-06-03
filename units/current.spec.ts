import { assert } from "chai";
import { print_expr } from "../src/print";
import { createSymEngine } from "../src/runtime/symengine";

describe("current", function () {
    xit("magnitude", function () {
        const lines: string[] = [
            `autofactor=0`,
            `implicate=0`,
            `(1/4+((-1/2*((1/2+(1/2*3**(1/2))*(-1)**(1/2))-(1/2+(-1/2*3**(1/2))*(-1)**(1/2))))*(-1)**(1/2))**2)**(1/2)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "1");
        engine.release();
    });
    xit("direction", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=1`,
            `arctan((-1/2*((1+3**(1/2)*(-1)**(1/2))-(1+(-3**(1/2))*(-1)**(1/2))))*(-1)**(1/2))`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "arctan(1/2*3**(1/2)-1/2*3**(1/2)*i)");
        engine.release();
    });
    xit("direction II", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=1`,
            `arctan(1/2*3**(1/2)-1/2*3**(1/2)*i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "arctan(1/2*3**(1/2)-1/2*3**(1/2)*i)");
        engine.release();
    });
    xit("product", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=1`,
            `((1/4+((-1/2*((1/2+(1/2*3**(1/2))*(-1)**(1/2))-(1/2+(-1/2*3**(1/2))*(-1)**(1/2))))*(-1)**(1/2))**2)**(1/2))*arctan(1/2*3**(1/2)-1/2*3**(1/2)*i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "arctan(1/2*3**(1/2)-1/2*3**(1/2)*i)");
        engine.release();
    });
    xit("exp(i*pi/3)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `exp(i*pi/3)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "1/2+(1/2*3**(1/2))*i");
        engine.release();
    });
    it("clock(1/2+(1/2*3**(1/2))*i)", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `clock(1/2+(1/2*3**(1/2))*i)`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "(-1)**(1/3)");
        engine.release();
    });
    it("clock(exp(i*pi/3))", function () {
        const lines: string[] = [
            `autofactor=1`,
            `implicate=0`,
            `clock(exp(i*pi/3))`,
        ];
        const engine = createSymEngine({
            dependencies: ['Imu'],
            useDefinitions: true
        });
        const $ = engine.$;
        const { values } = engine.executeScript(lines.join('\n'));
        assert.strictEqual(print_expr(values[0], $), "(-1)**(1/3)");
        engine.release();
    });
});
