import assert from "assert";
import { U } from "@stemcmicro/tree";
import { create_engine, ExprEngineListener } from "../src/api/api";

class TestListener implements ExprEngineListener {
    readonly outputs: string[] = [];
    output(output: string): void {
        this.outputs.push(output);
    }
}

const svg = [
    `<svg height='350'width='600'>`,
    `<line x1='350' y1='10' x2='350' y2='310' style='stroke:black;stroke-width:0.5'/>`,
    `<line x1='200' y1='160' x2='500' y2='160' style='stroke:black;stroke-width:0.5'/>`,
    `<line x1='200' y1='10' x2='500' y2='10' style='stroke:black;stroke-width:0.5'/>`,
    `<line x1='200' y1='310' x2='500' y2='310' style='stroke:black;stroke-width:0.5'/>`,
    `<line x1='200' y1='10' x2='200' y2='310' style='stroke:black;stroke-width:0.5'/>`,
    `<line x1='500' y1='10' x2='500' y2='310' style='stroke:black;stroke-width:0.5'/>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='176' y='21.91796875'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='163.5986328125' y='310'>&minus;</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='176' y='310'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='184.79931640625' y='340'>&minus;</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='197.20068359375' y='340'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='206.20068359375' y='340'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='491' y='340'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:18px;' x='500' y='340'>0</text>`,
    `<circle cx='200' cy='168.16031666334055' r='1.5' style='stroke:black;fill:black'/>`,
    `<circle cx='275' cy='188.76772823989415' r='1.5' style='stroke:black;fill:black'/>`,
    `<circle cx='425' cy='188.76772823989415' r='1.5' style='stroke:black;fill:black'/>`,
    `<circle cx='500' cy='168.16031666334055' r='1.5' style='stroke:black;fill:black'/>`,
    `</svg>`
].join("");

describe("draw", function () {
    it("sin(x)/x", function () {
        const lines: string[] = [`f=sin(x)/x`, `yrange=[-1,1]`, `draw(f,x,5)`];
        const sourceText = lines.join("\n");
        const engine = create_engine();
        const subscriber = new TestListener();
        engine.addListener(subscriber);
        const { trees, errors } = engine.parse(sourceText);
        if (errors.length > 0) {
            // eslint-disable-next-line no-console
            // console.lg(errors[0]);
        }
        assert.strictEqual(errors.length, 0);
        const values: U[] = [];
        for (const tree of trees) {
            const value = engine.valueOf(tree);
            if (!value.isnil) {
                values.push(value);
            }
        }
        assert.strictEqual(values.length, 0);
        const outputs = subscriber.outputs;
        assert.strictEqual(outputs.length, 1);
        assert.strictEqual(outputs[0], svg);
        engine.release();
    });
});
