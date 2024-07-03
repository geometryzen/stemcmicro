import { check } from "../src/check";

xdescribe("rationalize", function () {
    it("001", function () {
        check("rationalize(1/a+1/b)", "(a+b)/(a*b)");
    });
    it("002", function () {
        check("rationalize(1/a+1/b+1/2)", "(2*a+2*b+a*b)/(2*a*b)");
    });
});
