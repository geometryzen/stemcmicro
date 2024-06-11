import { check } from "../src/check";

describe("uom", function () {
    it("001", function () {
        check("ampere", "A");
        check("candela", "cd");
        check("coulomb", "C");
        check("farad", "F");
        check("henry", "H");
        check("hertz", "Hz");
        check("joule", "J");
        check("kelvin", "K");
        check("kilogram", "kg");
        check("meter", "m");
        check("metre", "m");
        check("mole", "mol");
        check("newton", "N");
        check("ohm", "Ω");
        check("one", "1");
        check("pascal", "Pa");
        check("second", "s");
        check("siemens", "S");
        check("tesla", "T");
        check("volt", "V");
        check("watt", "W");
        check("weber", "Wb");
    });
    it("mag", function () {
        check("mag(second)", "s");
    });
    it("division", function () {
        check("joule / coulomb", "V");
    });
});
