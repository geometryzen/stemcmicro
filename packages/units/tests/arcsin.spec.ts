import { check } from "../src/check";

xdescribe("arcsin", function () {
    it("001", function () {
        check("arcsin(1/2)", "1/6*pi");
    });
});
