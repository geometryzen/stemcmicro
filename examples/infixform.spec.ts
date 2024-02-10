import { check } from "./check";

describe("infixform", function () {
    xit("001", function () {
        check("infixform((x+1)**2)", "x**2");
    });
});
