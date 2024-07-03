import { check } from "../src/check";

xdescribe("cos", function () {
    it("001", function () {
        check("cos(pi/4)", "1/2**(1/2)");
    });
});
