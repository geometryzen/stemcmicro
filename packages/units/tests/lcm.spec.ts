import { check } from "../src/check";

xdescribe("lcm", function () {
    it("001", function () {
        check("lcm(42,35)", "210");
    });
});
