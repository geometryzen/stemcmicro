import { check } from "./check";

describe("multiply", function () {
    it("Rat * Rat", function () {
        check("2 * 3", "6");
        check("2 * -3", "-6");
    });
    it("Rat * Flt", function () {
        check("2 * 3.0", "6.0");
        check("2 * -3.0", "-6.0");
    });
    it("Rat * Sym", function () {
        check("2 * x", "2*x");
    });
    it("Uom * Uom", function () {
        check("meter * meter", "m ** 2");
        check("newton * meter", "J");
    });
    it("Rat * Uom", function () {
        check("5 * second", "5*s");
    });
});
