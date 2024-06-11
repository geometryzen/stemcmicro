import { check } from "../src/check";

describe("exp", function () {
    it("exp(i*pi)", function () {
        check("exp(sqrt(-1)*pi)", "-1");
    });
    it("exp(log(x))", function () {
        check("exp(log(x))", "x");
    });
    it("exp(i*x)", function () {
        check("exp(sqrt(-1)*x)", "e**(i*x)");
    });
});
