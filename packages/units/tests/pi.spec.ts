import { check } from "../src/check";

describe("pi", function () {
    it("001", function () {
        check("float(pi)", "3.141593...");
    });
});
