import { check } from "../src/check";

xdescribe("gcd", function () {
    it("001", function () {
        check("gcd(42,35)", "7");
    });
});
