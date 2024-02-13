import { check } from "./check";

describe("real", function () {
    it("real(z)", function () {
        check("real(2-3*sqrt(-1))", "2");
    });
    it("real(x: symbol)", function () {
        check("typeof(x)", "symbol");
        check("real(x)", "x");
    });
    it("real(x+i*y)", function () {
        check("real(x+sqrt(-1)*y)", "x");
    });
    it("real(exp(i*theta))", function () {
        check("real(exp(sqrt(-1)*theta))", "cos(theta)");
        check("real(exp(sqrt(-1)*0))", "1");
        check("real(exp(sqrt(-1)*pi))", "-1");
        check("real(exp(sqrt(-1)))", "cos(1)");
    });
});
