import { check } from "../src/check";

xdescribe("ceiling", function () {
    it("001", function () {
        check("ceiling(1/2)", "1");
    });
});
