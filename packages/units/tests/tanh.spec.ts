import { check } from "../src/check";

describe("tanh", function () {
    it("001", function () {
        check("tanh(x)", "tanh(x)");
        check("tanh(0)", "0");
    });
});
