import { check } from "../src/check";

xdescribe("besselj", function () {
    it("001", function () {
        check("besselj(0,0)", "1");
    });
});
