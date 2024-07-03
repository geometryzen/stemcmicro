import { check } from "../src/check";

xdescribe("log", function () {
    it("1", function () {
        check("log(1)", "0");
    });
    it("exp(1)", function () {
        check("log(exp(1))", "1");
    });
    it("exp(x)", function () {
        check("log(exp(x))", "x");
    });
    it("x**2", function () {
        check("log(x**2)", "2*log(x)");
    });
    it("1/x", function () {
        check("log(1/x)", "-log(x)");
    });
    it("x**y", function () {
        check("log(x**y)", "y*log(x)");
    });
    it("2", function () {
        check("log(2)", "log(2)");
    });
    it("2.0", function () {
        check("log(2.0)", "0.693147...");
    });
    it("a*b*c", function () {
        check("log(a*b*c)", "log(a)+log(b)+log(c)");
    });
    it("log(1/3)+log(3)", function () {
        check("log(1/3)+log(3)", "0");
    });
    it("log(1/n)+log(n)", function () {
        check("log(1/n)+log(n)", "0");
    });
    it("-1", function () {
        check("log(-1)", "i*pi");
    });
    it("-1.0", function () {
        check("log(-1.0)", "3.141593...*i");
    });
});
