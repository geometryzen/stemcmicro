import { check } from "../src/check";

xdescribe("tanh", function () {
    it("001", function () {
        check("tanh(x)", "tanh(x)");
        check("tanh(0)", "0");
    });
});
