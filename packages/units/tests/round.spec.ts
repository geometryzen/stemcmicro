import { check } from "../src/check";

xdescribe("round", function () {
    it("001", function () {
        check("round(1/2)", "1");
    });
});
