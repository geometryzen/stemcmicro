import { check } from "./check";

describe("log", function () {
    it("001", function () {
        check("log(x**y)", "y*log(x)");
    });
});
