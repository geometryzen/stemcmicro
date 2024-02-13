import { check } from "./check";

describe("exp", function () {
    it("exp(i*pi)", function () {
        check("exp(sqrt(-1)*pi)", "-1");
    });
    it("exp(log(x))", function () {
        check("exp(log(x))", "x");
    });
    xit("exp(i*theta)", function () {
        check("exp(sqrt(-1)*theta)", "cos(theta)+i*sin(theta)");
    });
});
