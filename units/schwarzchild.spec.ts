
import assert from 'assert';
import { create_script_context } from "../src/runtime/script_engine";
import { assert_one_value_execute } from "./assert_one_value_execute";

describe("schwardchild", function () {
    xit("demo", function () {
        const lines: string[] = [
            `gdd=zero(4,4)`,
            `gdd[1,1]=xi(r)`,
            `gdd[2,2]=-1/xi(r)`,
            `gdd[3,3]=r**2`,
            `gdd[4,4]=r**2 * sin(theta)**2`,
            `X=[t,r,theta,phi]`,
            `guu=inv(gdd)`,
            `gddd=d(gdd,X)`,
            `GAMDDD=1/2 * (gddd + transpose(gddd,2,3) - transpose(gddd,2,3,1,2))`,
            `GAMUDD=dot(guu,GAMDDD)`,
            `GAMUDDD=d(GAMUDD,X)`,
            `GAMGAM=dot(transpose(GAMUDD,2,3),GAMUDD)`,
            `RUDDD=transpose(GAMUDDD,3,4) - GAMUDDD + transpose(GAMGAM,2,3) - transpose(GAMGAM,2,3,3,4)`,
            `RDD=contract(RUDDD,1,3)`,
            `GAMDDD`
        ];
        const engine = create_script_context();
        const actual = assert_one_value_execute(lines.join('\n'), engine);
        assert.strictEqual(engine.renderAsInfix(actual), "?");
        engine.release();
    });
});