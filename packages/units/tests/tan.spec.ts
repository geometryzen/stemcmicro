import { check } from "../src/check";

xdescribe("tan", function () {
    it("001", function () {
        check("tan(pi/4)", "1");
    });
});
