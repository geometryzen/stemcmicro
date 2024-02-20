import { check } from "./check";

describe("multiply", function () {
    it("Rat * Rat", function () {
        check("2 * 3", "6");
        check("2 * -3", "-6");
    });
    it("Uom * Uom", function () {
        check("meter * meter", "m ** 2");
        check("newton * meter", "J");
    });
});
