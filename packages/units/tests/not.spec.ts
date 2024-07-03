import { check } from "../src/check";

xdescribe("not", function () {
    it("001", function () {
        check("not(false)", "true");
        check("not(true)", "false");
        check("not(0)", "true");
        check("not(1)", "false");
    });
});
