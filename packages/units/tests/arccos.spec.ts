import { check } from "../src/check";

xdescribe("arccos", function () {
    it("001", function () {
        check("arccos(1/2)", "1/3*pi");
    });
});
