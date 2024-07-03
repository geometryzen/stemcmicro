import { check } from "../src/check";

describe("arg", function () {
    xit("1", function () {
        check("arg(1)", "0");
    });
    it("i", function () {
        check("arg(sqrt(-1))", "1/2*pi");
    });
    it("-i", function () {
        check("arg(-sqrt(-1))", "-1/2*pi");
    });
    xit("zero", function () {
        check("arg(2-3*sqrt(-1))", "-arctan(3,2)");
    });
});
