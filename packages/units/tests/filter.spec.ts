import { check } from "../src/check";

xdescribe("filter", function () {
    it("001", function () {
        check("filter(x**2 + x + 1, x)", "1");
        check("filter(x**2 + x + 1, x**2)", "1+x");
    });
});
