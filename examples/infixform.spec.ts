import { check } from "./check";

describe("infixform", function () {
    it("001", function () {
        check("infixform((x+1)**2)", `"1 + 2 x + x**2"`);
    });
});
