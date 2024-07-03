import { check } from "../src/check";

xdescribe("sqrt", function () {
    it("001", function () {
        check("sqrt(10!)", "7**(1/2)*720");
    });
});
