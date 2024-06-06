import { check } from "./check";

describe("differential", function () {
    it("differential(x) +> dx", function () {
        check("differential(x)", "dx");
    });
    it("isinfinitesimal(dx) => true", function () {
        check("isinfinitesimal(differential(x))", "true");
    });
});
