import { check } from "../src/check";

xdescribe("draw", function () {
    it("001", function () {
        check("draw(sin(x)/x,x)", "()");
    });
});
