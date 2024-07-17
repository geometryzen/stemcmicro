import { check } from "../src/check";

describe("basics", function () {
    xit("001", function () {
        check("a+b", "a+b");
    });
    xit("002", function () {
        check("b+a", "a+b");
    });
    xit("003", function () {
        check("a*b", "a*b");
    });
    xit("004", function () {
        check("b*a", "a*b");
    });
    it("flatten", function () {
        check("w*(x*y*z)", "w*x*y*z");
    });
    it("flatten", function () {
        check("(w*x*y)*z", "w*x*y*z");
    });
    it("sorting", function () {
        check("d*c*b*a", "a*b*c*d");
        check("x*2*y*3*z*4", "24*x*y*z");
    });
    xit("left-distributive property of * with respect to +", function () {
        check("x*(y+z)", "x*y+x*z");
    });
    xit("right-distributive property of * with respect to +", function () {
        check("(x+y)*z", "x*z+y*z");
    });
    it("combine numerical factors", function () {
        check("x*2*y*3*z*4", "24*x*y*z");
    });
    it("cancel", function () {
        check("a*(1/a)", "1");
    });
    xit("cancel before distributive law", function () {
        // Should evaluate to 1...
        check("(a+b)*(1/(a+b))", "a/(a+b)+b/(a+b)");
    });
});
