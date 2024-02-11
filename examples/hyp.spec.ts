import { check } from "./check";

describe("Hym", function () {
    it("001", function () {
        check('infinitesimal("x")', "x");
    });
    it("002", function () {
        check('st(infinitesimal("x"))', "0");
    });
    it("002", function () {
        check('st(x)', "x");
    });
});
