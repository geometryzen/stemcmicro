import { check } from "../src/check";

xdescribe("unit", function () {
    it("(4)", function () {
        check("unit(4)", "[[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]");
    });
    it("(3)", function () {
        check("unit(3)", "[[1,0,0],[0,1,0],[0,0,1]]");
    });
    it("(2)", function () {
        check("unit(2)", "[[1,0],[0,1]]");
    });
    it("(1)", function () {
        check("unit(1)", "[[1]]");
    });
    it("(0)", function () {
        check("unit(0)", "[]");
    });
});
