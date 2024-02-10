import { check } from "./check";

describe("i", function () {
    it("001", function () {
        check("exp(sqrt(-1)*pi)", "-1");
    });
});
