import { check } from "../src/check";

xdescribe("or", function () {
    it("001", function () {
        check("or(false,false)", "false");
    });
    it("002", function () {
        check("or(false,true)", "true");
    });
    it("003", function () {
        check("or(true,false)", "true");
    });
    it("004", function () {
        check("or(true,true)", "true");
    });
    it("005", function () {
        check("or(0,0)", "false");
    });
    it("006", function () {
        check("or(0,1)", "true");
    });
    it("007", function () {
        check("or(1,0)", "true");
    });
    it("008", function () {
        check("or(1,1)", "true");
    });
});
