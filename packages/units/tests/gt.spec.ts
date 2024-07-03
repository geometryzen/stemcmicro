import { check } from "../src/check";

xdescribe("gt", function () {
    it("Rat, Rat", function () {
        check("1 > 0", "true");
        check("0 > 0", "false");
        check("0 > 1", "false");
    });
    it("Blade, Blade", function () {
        check("ex > ex", "false");
        check("ex > ey", "false");
    });
});
