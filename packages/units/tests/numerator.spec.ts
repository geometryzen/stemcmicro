import { check } from "../src/check";

xdescribe("numerator", function () {
    it("001", function () {
        check("numerator(a/b)", "a");
        check("numerator(1/x)", "1");
    });
});
