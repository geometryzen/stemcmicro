import { check } from "../src/check";

xdescribe("denominator", function () {
    it("001", function () {
        check("denominator(a/b)", "b");
        check("denominator(1/x)", "x");
    });
});
