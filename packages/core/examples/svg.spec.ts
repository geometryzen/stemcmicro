import { check } from "./check";

const svg = [
    `<svg height='36'width='119'>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='10' y='26'>1</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='22' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='34' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='46' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='58' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='70' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='82' y='26'>0</text>`,
    `<text style='font-family:"Times New Roman";font-size:24px;' x='100' y='26'>J</text>`,
    `</svg>`
].join("");

describe("svg", function () {
    it("001", function () {
        check("mega * joule", svg, { format: "SVG" });
    });
});
