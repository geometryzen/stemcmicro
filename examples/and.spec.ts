import { check } from "./check";

describe("and", function () {
    it("001", function () {
        check("and(false,false)", "false");
    });
    it("002", function () {
        check("and(false,true)", "false");
    });
    it("003", function () {
        check("and(true,false)", "false");
    });
    it("004", function () {
        check("and(true,true)", "true");
    });
    it("005", function () {
        check("and(0,0)", "false");
    });
    it("006", function () {
        check("and(0,1)", "false");
    });
    it("007", function () {
        check("and(1,0)", "false");
    });
    it("008", function () {
        check("and(1,1)", "true");
    });
});
