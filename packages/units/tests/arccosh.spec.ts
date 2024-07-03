import { check } from "../src/check";

describe("arccosh", function () {
    it("001", function () {
        check("arccosh(cosh(x))", "x");
    });
    it("002", function () {
        check("arccosh(1)", "0");
    });
    it("003", function () {
        check("arccosh(1.0)", "0.0");
    });
});
