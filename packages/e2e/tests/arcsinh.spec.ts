import { check } from "./check";

describe("arcsinh", function () {
    it("001", function () {
        check("arcsinh(sinh(x))", "x");
    });
    it("002", function () {
        check("arcsinh(0)", "0");
    });
    it("003", function () {
        check("arcsinh(1)", "arcsinh(1)");
    });
    it("004", function () {
        check("arcsinh(0.0)", "0.0");
    });
});
