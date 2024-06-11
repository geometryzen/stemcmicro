import { check } from "../src/check";

describe("subtraction", function () {
    it("Blade, Blade", function () {
        check("ex - ex", "0");
        // check("ex - ey", "ex - ey");
    });
});
