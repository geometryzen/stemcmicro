import { check } from "../src/check";

xdescribe("dim", function () {
    it("001", function () {
        check("dim([[1,2],[3,4],[5,6]],1)", "3");
    });
});
