import { check } from "../src/check";

describe("isprime", function () {
    it("001", function () {
        check("isprime(1)", "0");
        check("isprime(2)", "1");
        check("isprime(3)", "1");
        check("isprime(4)", "0");
        check("isprime(5)", "1");
        check("isprime(6)", "0");
        check("isprime(7)", "1");
        check("isprime(8)", "0");
        check("isprime(9)", "0");
    });
});
