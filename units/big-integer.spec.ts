import { assert } from "chai";
import { bigInt, BigInteger } from '../src/tree/rat/big-integer';

/**
 * A shim for simulating features available in Jasmine needed by BigInteger specification.
 */
class ActualWrapper {
    negate = false;
    constructor(private actual: unknown) {
        // 
    }
    get not(): this {
        this.negate = true;
        return this;
    }
    toBe(expected: number | string | boolean): void {
        if (typeof expected === 'boolean') {
            assert.strictEqual(this.actual, expected);
        }
        else if (typeof expected === 'string') {
            if (this.negate) {
                if (typeof this.actual === 'string') {
                    assert.isTrue(this.actual !== expected);
                }
                else {
                    assert.fail(typeof this.actual);
                }
            }
            else {
                assert.strictEqual(this.actual, expected);
            }
        }
        else if (typeof expected === 'number') {
            assert.strictEqual(this.actual, expected);
        }
        else {
            assert.fail(typeof expected);
        }
    }
    toBeLessThan(value: number): void {
        if (typeof this.actual === 'number') {
            assert.isTrue(this.actual < value);
        }
        else {
            assert.fail(typeof this.actual);
        }
    }
    toEqual(expected: unknown): void {
        if (typeof expected === 'string') {
            assert.strictEqual(this.actual, expected);
        }
        else if (typeof expected === 'object') {
            if (Array.isArray(expected) && Array.isArray(this.actual)) {
                assert.deepEqual(expected, this.actual);
            }
            else {
                assert.deepEqual(this.actual, expected);
            }
        }
        else {
            assert.fail(typeof expected);
        }
    }
    toEqualBigInt(expected: number | BigInteger | string) {
        if (typeof expected === 'number') {
            if (bigInt.isInstance(this.actual)) {
                assert.isTrue(this.actual.equals(expected));
            }
            else if (typeof this.actual === 'string') {
                assert.isTrue(bigInt(this.actual).equals(expected));
            }
            else if (typeof this.actual === 'number') {
                if (this.negate) {
                    assert.isFalse(bigInt(this.actual).equals(expected));
                }
                else {
                    assert.isTrue(bigInt(this.actual).equals(expected), `${this.actual}, ${expected}`);
                }
            }
            else {
                assert.fail(typeof this.actual);
            }
            // assert.isTrue(bigInt(this.actual).equals(expected));
        }
        else if (typeof expected === 'string') {
            if (typeof this.actual === 'string') {
                if (this.negate) {
                    assert.isFalse(bigInt(this.actual).equals(expected));
                }
                else {
                    assert.isTrue(bigInt(this.actual).equals(expected));
                }
            }
            else if (typeof this.actual === 'number') {
                assert.isTrue(bigInt(this.actual).equals(expected));
            }
            else if (bigInt.isInstance(this.actual)) {
                assert.isTrue(this.actual.equals(expected));
            }
            else {
                assert.fail(typeof this.actual);
            }
        }
        else if (typeof expected === 'object') {
            if (bigInt.isInstance(expected)) {
                if (bigInt.isInstance(this.actual)) {
                    assert.isTrue(this.actual.equals(expected));
                }
                else {
                    assert.fail(typeof this.actual);
                }
            }
            else {
                assert.fail(typeof this.actual);
            }
            // assert.isTrue(bigInt(this.actual).equals(expected));
        }
        else {
            assert.fail(typeof expected);
        }
        /*
            compare: function (actual, expected) {
                return { pass: bigInt(actual).equals(expected) };
            }
        };
        */
    }
    toThrow() {
        if (typeof this.actual === 'function') {
            try {
                this.actual();
                assert.fail();
            }
            catch (e) {
                // Expected.
            }
        }
        else {
            assert.fail(typeof this.actual);
        }
    }
}

function expect(actual: unknown): ActualWrapper {
    return new ActualWrapper(actual);
}


describe("BigInteger", function () {

    const a = "1234567890";
    const b = a + a + a + a + a + a + a + a + a + a;
    const c = b + b + b + b + b + b + b + b + b + b;
    const d = c + c + c + c + c + c + c + c + c + c;
    const e = d + d + d;

    /*
    beforeAll(function () {
        jasmine.addMatchers({
            toEqualBigInt: function () {
                return {
                    compare: function (actual, expected) {
                        return { pass: bigInt(actual).equals(expected) };
                    }
                };
            }
        });
    });
    */

    it("can handle large numbers", function () {
        const tenFactorial = "3628800";
        const hundredFactorial = "93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000";
        const threeToTenThousand = "16313501853426258743032567291811547168121324535825379939348203261918257308143190787480155630847848309673252045223235795433405582999177203852381479145368112501453192355166224391025423628843556686559659645012014177448275529990373274425446425751235537341867387607813619937225616872862016504805593174059909520461668500663118926911571773452255850626968526251879139867085080472539640933730243410152186914328917354576854457274195562218013337745628502470673059426999114202540773175988199842487276183685299388927825296786440252999444785694183675323521704432195785806270123388382931770198990841300861506996108944782065015163410344894945809337689156807686673462563038164792190665340124344133980763205594364754963451564072340502606377790585114123814919001637177034457385019939060232925194471114235892978565322415628344142184842892083466227875760501276009801530703037525839157893875741192497705300469691062454369926795975456340236777734354667139072601574969834312769653557184396147587071260443947944862235744459711204473062937764153770030210332183635531818173456618022745975055313212598514429587545547296534609597194836036546870491771927625214352957503454948403635822345728774885175809500158451837389413798095329711993092101417428406774326126450005467888736546254948658602484494535938888656542746977424368385335496083164921318601934977025095780370104307980276356857350349205866078371806065542393536101673402017980951598946980664330391505845803674248348878071010412918667335823849899623486215050304052577789848512410263834811719236949311423411823585316405085306164936671137456985394285677324771775046050970865520893596151687017153855755197348199659070192954771308347627111052471134476325986362838585959552209645382089055182871854866744633737533217524880118401787595094060855717010144087136495532418544241489437080074716158404895914136451802032446707961058757633345691696743293869623745410870051851590672859347061212573446572045088465460616826082579731686004585218284333452396157730036306379421822435818001505905203918209206969662326706952623512427380240468784114535101496733983401240219840048956733689309620321613793757156727562461651933397540266795963865921590913322060572673349849253303397874242381960775337182730037783698708748781738419747698880321601186310506332869704931303076839444790968339306301273371014087248060946851793697973114432706759288546077622831002526800554849696867710280945946603669593797354642136622231192695027321229511912952940320879763123151760555959496961163141455688278842949587288399100273691880018774147568892650186152065335219113072582417699616901995530249937735219099786758954892534365835235843156112799728164123461219817343904782402517111603206575330527850752564642995318064985900815557979945885931124351303252811255254295797082281946658798705979077492469849644183166585950844953164726896146168297808178398470451561320526180542310840744843107469368959707726836608471817060598771730170755446473440774031371227437651048421606224757527085958515947273151027400662948161111284777828103531499488913672800783167888051177155427285103861736658069404797695900758820465238673970882660162285107599221418743657006872537842677883708807515850397691812433880561772652364847297019508025848964833883225165668986935081274596293983121864046277268590401580209059988500511262470167150495261908136688693861324081559046336288963037090312033522400722360882494928182809075406914319957044927504420797278117837677431446979085756432990753582588102440240611039084516401089948868433353748444104639734074519165067632941419347985624435567342072815910754484123812917487312938280670403228188813003978384081332242484646571417574404852962675165616101527367425654869508712001788393846171780457455963045764943565964887518396481296159902471996735508854292964536796779404377230965723361625182030798297734785854606060323419091646711138678490928840107449923456834763763114226000770316931243666699425694828181155048843161380832067845480569758457751090640996007242018255400627276908188082601795520167054701327802366989747082835481105543878446889896230696091881643547476154998574015907396059478684978574180486798918438643164618541351689258379042326487669479733384712996754251703808037828636599654447727795924596382283226723503386540591321268603222892807562509801015765174359627788357881606366119032951829868274617539946921221330284257027058653162292482686679275266764009881985590648534544939224296689791195355783205968492422636277656735338488299104238060289209390654467316291591219712866052661347026855261289381236881063068219249064767086495184176816629077103667131505064964190910450196502178972477361881300608688593782509793781457170396897496908861893034634895715117114601514654381347139092345833472226493656930996045016355808162984965203661519182202145414866559662218796964329217241498105206552200001";
        function factorial(n: BigInteger): BigInteger {
            if (n.equals(bigInt.zero) || n.equals(bigInt.one)) {
                return bigInt.one;
            }
            return factorial(n.prev()).times(n);
        }
        expect(factorial(bigInt(10))).toEqualBigInt(tenFactorial);
        expect(factorial(bigInt(100))).toEqualBigInt(hundredFactorial);
        expect(bigInt(3).pow(10000)).toEqualBigInt(threeToTenThousand);
    });

    // See issue #7
    //   https://github.com/peterolson/BigInteger.js/issues/7
    it("is immutable", function () {
        const n = bigInt(14930352);
        n.add(9227465);
        expect(n).toEqualBigInt(14930352);
        n.subtract(123456);
        expect(n).toEqualBigInt(14930352);
    });

    describe("Equality and comparison", function () {
        it("works for positive numbers", function () {
            expect(bigInt.one).toEqualBigInt(1);
            expect(1).not.toEqualBigInt(2);
            expect(0).not.toEqualBigInt(1);
            expect(987).toEqualBigInt(987);
            expect(987).not.toEqualBigInt(789);
            expect(7895).not.toEqualBigInt(9875);
            expect("98765432101234567890").toEqualBigInt("98765432101234567890");
            expect("98765432101234567890").not.toEqualBigInt("98765432101234567999");
            expect("98765432101234567890").not.toEqualBigInt("98765432101234567000");

            expect(bigInt(54).greater(45)).toBe(true);
            expect(bigInt(45).greater(54)).toBe(false);
            expect(bigInt(45).greater(45)).toBe(false);
            expect(bigInt("5498765432109876").greater("4598765432109876")).toBe(true);
            expect(bigInt("4598765432109876").greater("5498765432109876")).toBe(false);
            expect(bigInt("4598765432109876").greater("4598765432109876")).toBe(false);

            expect(bigInt(32).greaterOrEquals(23)).toBe(true);
            expect(bigInt(23).greaterOrEquals(32)).toBe(false);
            expect(bigInt(23).greaterOrEquals(23)).toBe(true);
            expect(bigInt("3298763232109876").greaterOrEquals("2398763232109876")).toBe(true);
            expect(bigInt("2398763232109876").greaterOrEquals("3298763232109876")).toBe(false);
            expect(bigInt("2398763232109876").greaterOrEquals("2398763232109876")).toBe(true);

            expect(bigInt(987).lesser(789)).toBe(false);
            expect(bigInt(789).lesser(987)).toBe(true);
            expect(bigInt(789).lesser(789)).toBe(false);
            expect(bigInt("987987698732109876").lesser("789987698732109876")).toBe(false);
            expect(bigInt("789987698732109876").lesser("987987698732109876")).toBe(true);
            expect(bigInt("789987698732109876").lesser("789987698732109876")).toBe(false);

            expect(bigInt(6012).lesserOrEquals(1195)).toBe(false);
            expect(bigInt(1195).lesserOrEquals(6012)).toBe(true);
            expect(bigInt(1195).lesserOrEquals(1195)).toBe(true);
            expect(bigInt("6012987660126012109876").lesserOrEquals("1195987660126012109876")).toBe(false);
            expect(bigInt("1195987660126012109876").lesserOrEquals("6012987660126012109876")).toBe(true);
            expect(bigInt("1195987660126012109876").lesserOrEquals("1195987660126012109876")).toBe(true);

            expect(bigInt(54).notEquals(45)).toBe(true);
            expect(bigInt(45).notEquals(54)).toBe(true);
            expect(bigInt(45).notEquals(45)).toBe(false);
            expect(bigInt("5498765432109876").notEquals("4598765432109876")).toBe(true);
            expect(bigInt("4598765432109876").notEquals("5498765432109876")).toBe(true);
            expect(bigInt("4598765432109876").notEquals("4598765432109876")).toBe(false);

            expect(bigInt("306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000")).toEqualBigInt("306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000");
            expect(bigInt("234345345345")).toEqualBigInt("234345345345");
            expect(bigInt("1230000000")).toEqualBigInt("1230000000");
        });

        it("works for negative numbers", function () {
            expect(bigInt.minusOne).toEqualBigInt(-1);
            expect(-1).not.toEqualBigInt(-2);
            expect(-0).not.toEqualBigInt(-1);
            expect(-987).toEqualBigInt(-987);
            expect(-987).not.toEqualBigInt(-789);
            expect(-7895).not.toEqualBigInt(-9875);
            expect("-98765432101234567890").toEqualBigInt("-98765432101234567890");
            expect("-98765432101234567890").not.toEqualBigInt("-98765432101234567999");
            expect("-98765432101234567890").not.toEqualBigInt("-98765432101234567000");

            expect(bigInt(-54).greater(-45)).toBe(false);
            expect(bigInt(-45).greater(-54)).toBe(true);
            expect(bigInt(-45).greater(-45)).toBe(false);
            expect(bigInt(45).greater("-549876540654065065132109876")).toBe(true);
            expect(bigInt(-45).greater("-549876540654065065132109876")).toBe(true);
            expect(bigInt(45).greater("549876540654065065132109876")).toBe(false);
            expect(bigInt(-45).greater("549876540654065065132109876")).toBe(false);
            expect(bigInt("-5498765432109876").greater("-4598765432109876")).toBe(false);
            expect(bigInt("-4598765432109876").greater("-5498765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").greater("-4598765432109876")).toBe(false);

            expect(bigInt(-32).greaterOrEquals(-23)).toBe(false);
            expect(bigInt(-23).greaterOrEquals(-32)).toBe(true);
            expect(bigInt(-23).greaterOrEquals(-23)).toBe(true);
            expect(bigInt("-3298763232109876").greaterOrEquals("-2398763232109876")).toBe(false);
            expect(bigInt("-2398763232109876").greaterOrEquals("-3298763232109876")).toBe(true);
            expect(bigInt("-2398763232109876").greaterOrEquals("-2398763232109876")).toBe(true);

            expect(bigInt(-987).lesser(-789)).toBe(true);
            expect(bigInt(-789).lesser(-987)).toBe(false);
            expect(bigInt(-789).lesser(-789)).toBe(false);
            expect(bigInt("-987987698732109876").lesser(82)).toBe(true);
            expect(bigInt("-987987698732109876").lesser(-82)).toBe(true);
            expect(bigInt("-987987698732109876").lesser("-789987698732109876")).toBe(true);
            expect(bigInt("-789987698732109876").lesser("-987987698732109876")).toBe(false);
            expect(bigInt("-789987698732109876").lesser("-789987698732109876")).toBe(false);

            expect(bigInt(-6012).lesserOrEquals(-1195)).toBe(true);
            expect(bigInt(-1195).lesserOrEquals(-6012)).toBe(false);
            expect(bigInt(-1195).lesserOrEquals(-1195)).toBe(true);
            expect(bigInt("-6012987660126012109876").lesserOrEquals("-1195987660126012109876")).toBe(true);
            expect(bigInt("-1195987660126012109876").lesserOrEquals("-6012987660126012109876")).toBe(false);
            expect(bigInt("-1195987660126012109876").lesserOrEquals("-1195987660126012109876")).toBe(true);

            expect(bigInt(-54).notEquals(-45)).toBe(true);
            expect(bigInt(-45).notEquals(-54)).toBe(true);
            expect(bigInt(-45).notEquals(-45)).toBe(false);
            expect(bigInt("-5498765432109876").notEquals("-4598765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").notEquals("-5498765432109876")).toBe(true);
            expect(bigInt("-4598765432109876").notEquals("-4598765432109876")).toBe(false);

            expect(bigInt("-1")).toEqualBigInt("-1");
            expect(bigInt("-10000000000000000")).toEqualBigInt("-10000000000000000");
        });

        it("treats negative and positive numbers differently", function () {
            expect(54).not.toEqualBigInt(-54);
            expect("-123456789876543210").not.toEqualBigInt("123456789876543210");
            expect(bigInt(76).notEquals(-76)).toBe(true);

            expect(bigInt(2).greater(-2)).toBe(true);
            expect(bigInt(-2).greater(2)).toBe(false);
            expect(bigInt(2).greater(-3)).toBe(true);
            expect(bigInt(2).greater(-1)).toBe(true);
            expect(bigInt(-2).greater(3)).toBe(false);
            expect(bigInt(-2).greater(1)).toBe(false);

            expect(bigInt(2).greaterOrEquals(-2)).toBe(true);
            expect(bigInt(-2).greaterOrEquals(2)).toBe(false);
            expect(bigInt(2).greaterOrEquals(-3)).toBe(true);
            expect(bigInt(2).greaterOrEquals(-1)).toBe(true);
            expect(bigInt(-2).greaterOrEquals(3)).toBe(false);
            expect(bigInt(-2).greaterOrEquals(1)).toBe(false);

            expect(bigInt(2).lesser(-2)).toBe(false);
            expect(bigInt(-2).lesser(2)).toBe(true);
            expect(bigInt(2).lesser(-3)).toBe(false);
            expect(bigInt(2).lesser(-1)).toBe(false);
            expect(bigInt(-2).lesser(3)).toBe(true);
            expect(bigInt(-2).lesser(1)).toBe(true);

            expect(bigInt(2).lesserOrEquals(-2)).toBe(false);
            expect(bigInt(-2).lesserOrEquals(2)).toBe(true);
            expect(bigInt(2).lesserOrEquals(-3)).toBe(false);
            expect(bigInt(2).lesserOrEquals(-1)).toBe(false);
            expect(bigInt(-2).lesserOrEquals(3)).toBe(true);
            expect(bigInt(-2).lesserOrEquals(1)).toBe(true);
        });

        it("compareAbs treats negative and positive numbers the same", function () {
            expect(bigInt(0).compareAbs(36)).toBe(-1);
            expect(bigInt(0).compareAbs(-36)).toBe(-1);
            expect(bigInt(36).compareAbs(5)).toBe(1);
            expect(bigInt(36).compareAbs(-5)).toBe(1);
            expect(bigInt(-36).compareAbs(5)).toBe(1);
            expect(bigInt(-36).compareAbs(-5)).toBe(1);
            expect(bigInt(5).compareAbs(36)).toBe(-1);
            expect(bigInt(5).compareAbs(-36)).toBe(-1);
            expect(bigInt(-5).compareAbs(36)).toBe(-1);
            expect(bigInt(-5).compareAbs(-36)).toBe(-1);
            expect(bigInt(36).compareAbs(36)).toBe(0);
            expect(bigInt(36).compareAbs(-36)).toBe(0);
            expect(bigInt(-36).compareAbs(36)).toBe(0);
            expect(bigInt(-36).compareAbs(-36)).toBe(0);

            expect(bigInt(0).compareAbs("9999999999999999999")).toBe(-1);
            expect(bigInt(0).compareAbs("-9999999999999999999")).toBe(-1);
            expect(bigInt("9999999999999999999").compareAbs("55555555555555555")).toBe(1);
            expect(bigInt("9999999999999999999").compareAbs("-55555555555555555")).toBe(1);
            expect(bigInt("-9999999999999999999").compareAbs("55555555555555555")).toBe(1);
            expect(bigInt("-9999999999999999999").compareAbs("-55555555555555555")).toBe(1);
            expect(bigInt("55555555555555555").compareAbs("9999999999999999999")).toBe(-1);
            expect(bigInt("55555555555555555").compareAbs("-9999999999999999999")).toBe(-1);
            expect(bigInt("-55555555555555555").compareAbs("9999999999999999999")).toBe(-1);
            expect(bigInt("-55555555555555555").compareAbs("-9999999999999999999")).toBe(-1);
            expect(bigInt("9999999999999999999").compareAbs("9999999999999999999")).toBe(0);
            expect(bigInt("9999999999999999999").compareAbs("-9999999999999999999")).toBe(0);
            expect(bigInt("-9999999999999999999").compareAbs("9999999999999999999")).toBe(0);
            expect(bigInt("-9999999999999999999").compareAbs("-9999999999999999999")).toBe(0);
        });

        it("treats 0 and -0 the same", function () {
            expect(0).toEqualBigInt("-0");
            expect(bigInt.zero).toEqualBigInt("-0");
        });

        it("ignores leading zeros", function () {
            expect("0000000000").toEqualBigInt("0");
            expect("000000000000023").toEqualBigInt(23);
            expect(bigInt("-0000000000000000000000123")).toEqualBigInt("-123");
        });

        it("treats numbers constructed different ways the same", function () {
            expect("12e5").toEqualBigInt(12e5);
            expect(12e5).toEqualBigInt("1200000");
            expect("1").toEqualBigInt(1);
            expect(bigInt(12345)).toEqualBigInt("12345");
            expect(bigInt("9876543210")).toEqualBigInt(bigInt(9876543210));
        });

        it("allows Infinity and -Infinity", function () {
            // See issue #61 
            // https://github.com/peterolson/BigInteger.js/issues/61
            expect(bigInt(56).lesser(Infinity)).toBe(true);
            expect(bigInt(56).greater(-Infinity)).toBe(true);
            expect(bigInt("50e50").lesser(Infinity)).toBe(true);
            expect(bigInt("50e50").greater(-Infinity)).toBe(true);
        });
    });

    describe("Addition and subtraction", function () {
        it("by 0 is the identity", function () {
            expect(bigInt(1).add(0)).toEqualBigInt(1);
            expect(bigInt(-1).add(0)).toEqualBigInt(-1);
            expect(bigInt(0).add(-1)).toEqualBigInt(-1);
            expect(bigInt(0).add(153)).toEqualBigInt(153);
            expect(bigInt(153).add(0)).toEqualBigInt(153);
            expect(bigInt(0).add(-153)).toEqualBigInt(-153);
            expect(bigInt(-153).add(0)).toEqualBigInt(-153);
            expect(bigInt(0).add("9844190321790980841789")).toEqualBigInt("9844190321790980841789");
            expect(bigInt("9844190321790980841789").add(0)).toEqualBigInt("9844190321790980841789");
            expect(bigInt(0).add("-9844190321790980841789")).toEqualBigInt("-9844190321790980841789");
            expect(bigInt("-9844190321790980841789").add(0)).toEqualBigInt("-9844190321790980841789");

            expect(bigInt(1).minus(0)).toEqualBigInt(1);
            expect(bigInt(-1).minus(0)).toEqualBigInt(-1);
            expect(bigInt(153).minus(0)).toEqualBigInt(153);
            expect(bigInt(-153).minus(0)).toEqualBigInt(-153);
            expect(bigInt("9844190321790980841789").minus(0)).toEqualBigInt("9844190321790980841789");
            expect(bigInt("-9844190321790980841789").minus(0)).toEqualBigInt("-9844190321790980841789");
        });

        it("addition by inverse is 0, subtraction by self is 0", function () {
            expect(bigInt("5").subtract(bigInt("5"))).toEqualBigInt(0);
            expect(bigInt("5").add(bigInt("-5"))).toEqualBigInt(0);
            expect(bigInt("10000000000000000").subtract(bigInt("10000000000000000"))).toEqualBigInt(0);
            expect(bigInt("10000000000000000").add(bigInt("-10000000000000000"))).toEqualBigInt(0);
        });

        it("handles signs correctly", function () {
            expect(bigInt(1).add(1)).toEqualBigInt(2);
            expect(bigInt(1).add(-5)).toEqualBigInt(-4);
            expect(bigInt(-1).add(5)).toEqualBigInt(4);
            expect(bigInt(-1).add(-5)).toEqualBigInt(-6);
            expect(bigInt(5).add(1)).toEqualBigInt(6);
            expect(bigInt(5).add(-1)).toEqualBigInt(4);
            expect(bigInt(-5).add(1)).toEqualBigInt(-4);
            expect(bigInt(-5).add(-1)).toEqualBigInt(-6);

            expect(bigInt(1).minus(1)).toEqualBigInt(0);
            expect(bigInt(1).minus(-5)).toEqualBigInt(6);
            expect(bigInt(-1).minus(5)).toEqualBigInt(-6);
            expect(bigInt(-1).minus(-5)).toEqualBigInt(4);
            expect(bigInt(5).minus(1)).toEqualBigInt(4);
            expect(bigInt(5).minus(-1)).toEqualBigInt(6);
            expect(bigInt(-5).minus(1)).toEqualBigInt(-6);
            expect(bigInt(-5).minus(-1)).toEqualBigInt(-4);

            expect(bigInt("1234698764971301").add(5)).toEqualBigInt("1234698764971306");
            expect(bigInt("1234698764971301").add(-5)).toEqualBigInt("1234698764971296");
            expect(bigInt("-1234698764971301").add(5)).toEqualBigInt("-1234698764971296");
            expect(bigInt("-1234698764971301").add(-5)).toEqualBigInt("-1234698764971306");
            expect(bigInt(5).add("1234698764971301")).toEqualBigInt("1234698764971306");
            expect(bigInt(5).add("-1234698764971301")).toEqualBigInt("-1234698764971296");
            expect(bigInt(-5).add("1234698764971301")).toEqualBigInt("1234698764971296");
            expect(bigInt(-5).add("-1234698764971301")).toEqualBigInt("-1234698764971306");

            expect(bigInt("1234698764971301").minus(5)).toEqualBigInt("1234698764971296");
            expect(bigInt("1234698764971301").minus(-5)).toEqualBigInt("1234698764971306");
            expect(bigInt("-1234698764971301").minus(5)).toEqualBigInt("-1234698764971306");
            expect(bigInt("-1234698764971301").minus(-5)).toEqualBigInt("-1234698764971296");
            expect(bigInt(5).minus("1234698764971301")).toEqualBigInt("-1234698764971296");
            expect(bigInt(5).minus("-1234698764971301")).toEqualBigInt("1234698764971306");
            expect(bigInt(-5).minus("1234698764971301")).toEqualBigInt("-1234698764971306");
            expect(bigInt(-5).minus("-1234698764971301")).toEqualBigInt("1234698764971296");

            expect(bigInt("1234567890987654321").plus("9876543210123456789")).toEqualBigInt("11111111101111111110");
            expect(bigInt("1234567890987654321").plus("-9876543210123456789")).toEqualBigInt("-8641975319135802468");
            expect(bigInt("-1234567890987654321").plus("9876543210123456789")).toEqualBigInt("8641975319135802468");
            expect(bigInt("-1234567890987654321").plus("-9876543210123456789")).toEqualBigInt("-11111111101111111110");
            expect(bigInt("9876543210123456789").plus("1234567890987654321")).toEqualBigInt("11111111101111111110");
            expect(bigInt("9876543210123456789").plus("-1234567890987654321")).toEqualBigInt("8641975319135802468");
            expect(bigInt("-9876543210123456789").plus("1234567890987654321")).toEqualBigInt("-8641975319135802468");
            expect(bigInt("-9876543210123456789").plus("-1234567890987654321")).toEqualBigInt("-11111111101111111110");

            expect(bigInt("1234567890987654321").minus("9876543210123456789")).toEqualBigInt("-8641975319135802468");
            expect(bigInt("1234567890987654321").minus("-9876543210123456789")).toEqualBigInt("11111111101111111110");
            expect(bigInt("-1234567890987654321").minus("9876543210123456789")).toEqualBigInt("-11111111101111111110");
            expect(bigInt("-1234567890987654321").minus("-9876543210123456789")).toEqualBigInt("8641975319135802468");
            expect(bigInt("9876543210123456789").minus("1234567890987654321")).toEqualBigInt("8641975319135802468");
            expect(bigInt("9876543210123456789").minus("-1234567890987654321")).toEqualBigInt("11111111101111111110");
            expect(bigInt("-9876543210123456789").minus("1234567890987654321")).toEqualBigInt("-11111111101111111110");
            expect(bigInt("-9876543210123456789").minus("-1234567890987654321")).toEqualBigInt("-8641975319135802468");

            expect(bigInt("-9007199254740991").add(bigInt("-1")).toString() === "-9007199254740992").toBe(true);
            expect(bigInt("-5616421592529327000000000000000").minus("987682355516543").toString() === "-5616421592529327987682355516543").toBe(true);

            expect(bigInt("0").negate().add("10000000000000000")).toEqualBigInt("10000000000000000");
            expect(bigInt("0").negate().add(bigInt("-1"))).toEqualBigInt("-1");
        });

        it("carries over correctly", function () {
            // Fibonacci; see issue #9
            //   https://github.com/peterolson/BigInteger.js/issues/9
            const fibs = ["1", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89", "144", "233", "377", "610", "987", "1597", "2584", "4181", "6765", "10946", "17711", "28657", "46368", "75025", "121393", "196418", "317811", "514229", "832040", "1346269", "2178309", "3524578", "5702887", "9227465", "14930352", "24157817", "39088169", "63245986", "102334155", "165580141", "267914296", "433494437", "701408733", "1134903170", "1836311903", "2971215073", "4807526976", "7778742049", "12586269025"];
            let number = bigInt(1);
            let last = bigInt(1);

            for (let i = 2; i < 50; i++) {
                number = number.add(last);
                last = number.minus(last);
                expect(number).toEqualBigInt(fibs[i]);
            }

            expect(bigInt("9007199254740991").add(bigInt("1")).toString()).toBe("9007199254740992");
            expect(bigInt("999999999999999999999000000000000000000000").add("1000000000000000000000")).toEqualBigInt("1e42");
            expect(bigInt("1e20").add("9007199254740972")).toEqualBigInt("100009007199254740972");
            expect(bigInt("-9007199254740983").add(bigInt("-9999999999999998")).toString() === "-19007199254740981").toBe(true); // issue #42

            expect(bigInt(c).minus(bigInt(b).next())).toEqualBigInt("1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678899999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999");
            expect(bigInt(b).minus(bigInt(c).next())).toEqualBigInt("-1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001");
            expect(bigInt("100000000000000000000000000000000000").minus("999999999999999999")).toEqualBigInt("99999999999999999000000000000000001");

            expect(bigInt("10000000010000000").subtract("10000000")).toEqualBigInt("10000000000000000"); // issue #54
        });

        it("work", function () {
            expect(bigInt("10").add("10")).toEqualBigInt("20");
            expect(bigInt("-10000000000000000").add("0")).toEqualBigInt("-10000000000000000");
            expect(bigInt("0").add("10000000000000000")).toEqualBigInt("10000000000000000");
            expect(bigInt(9999999).add(1)).toEqualBigInt(10000000);
            expect(bigInt(10000000).minus(1)).toEqualBigInt(9999999);
            expect(bigInt("-1000000000000000000000000000000000001").add("1000000000000000000000000000000000000")).toEqualBigInt(-1);
            expect(bigInt("100000000000000000002222222222222222222").minus("100000000000000000001111111111111111111")).toEqualBigInt("1111111111111111111");
            expect(bigInt("1").add("0")).toEqualBigInt("1");
            expect(bigInt("10").add("10000000000000000")).toEqualBigInt("10000000000000010");
            expect(bigInt("10000000000000000").add("10")).toEqualBigInt("10000000000000010");
            expect(bigInt("10000000000000000").add("10000000000000000")).toEqualBigInt("20000000000000000");
        });
    });

    describe("Multiplication", function () {
        it("by 0 equals 0", function () {
            expect(bigInt(0).times(0)).toEqualBigInt(0);
            expect(bigInt(0).times("-0")).toEqualBigInt(0);
            expect(bigInt(1).times(0)).toEqualBigInt("-0");
            expect(bigInt(-0).times(1)).toEqualBigInt(0);
            expect(bigInt("1234567890987654321").times(0)).toEqualBigInt("-0");
            expect(bigInt(-0).times("1234567890987654321")).toEqualBigInt(0);
            expect(bigInt(0).times("-1234567890987654321")).toEqualBigInt(0);
        });

        it("by 1 is the identity", function () {
            expect(bigInt(1).times(1)).toEqualBigInt(1);
            expect(bigInt(-1).times(1)).toEqualBigInt(-1);
            expect(bigInt(1).times(-1)).toEqualBigInt(-1);
            expect(bigInt(1).times(153)).toEqualBigInt(153);
            expect(bigInt(153).times(1)).toEqualBigInt(153);
            expect(bigInt(1).times(-153)).toEqualBigInt(-153);
            expect(bigInt(-153).times(1)).toEqualBigInt(-153);
            expect(bigInt(1).times("9844190321790980841789")).toEqualBigInt("9844190321790980841789");
            expect(bigInt("9844190321790980841789").times(1)).toEqualBigInt("9844190321790980841789");
            expect(bigInt(1).times("-9844190321790980841789")).toEqualBigInt("-9844190321790980841789");
            expect(bigInt("-9844190321790980841789").times(1)).toEqualBigInt("-9844190321790980841789");
        });

        it("handles signs correctly", function () {
            expect(bigInt(100).times(100)).toEqualBigInt(10000);
            expect(bigInt(100).times(-100)).toEqualBigInt(-10000);
            expect(bigInt(-100).times(100)).toEqualBigInt(-10000);
            expect(bigInt(-100).times(-100)).toEqualBigInt(10000);

            expect(bigInt(13579).times("163500573666152634716420931676158")).toEqualBigInt("2220174289812686626814279831230549482");
            expect(bigInt(13579).times("-163500573666152634716420931676158")).toEqualBigInt("-2220174289812686626814279831230549482");
            expect(bigInt(-13579).times("163500573666152634716420931676158")).toEqualBigInt("-2220174289812686626814279831230549482");
            expect(bigInt(-13579).times("-163500573666152634716420931676158")).toEqualBigInt("2220174289812686626814279831230549482");
            expect(bigInt("163500573666152634716420931676158").times(13579)).toEqualBigInt("2220174289812686626814279831230549482");
            expect(bigInt("163500573666152634716420931676158").times(-13579)).toEqualBigInt("-2220174289812686626814279831230549482");
            expect(bigInt("-163500573666152634716420931676158").times(13579)).toEqualBigInt("-2220174289812686626814279831230549482");
            expect(bigInt("-163500573666152634716420931676158").times(-13579)).toEqualBigInt("2220174289812686626814279831230549482");
            expect(bigInt("163500573666152634716420931676158").times(-1)).toEqualBigInt("-163500573666152634716420931676158");

            expect(bigInt("1234567890987654321").times("132435465768798")).toEqualBigInt("163500573666152634716420931676158");
            expect(bigInt("1234567890987654321").times("-132435465768798")).toEqualBigInt("-163500573666152634716420931676158");
            expect(bigInt("-1234567890987654321").times("132435465768798")).toEqualBigInt("-163500573666152634716420931676158");
            expect(bigInt("-1234567890987654321").times("-132435465768798")).toEqualBigInt("163500573666152634716420931676158");
        });

        it("carries over correctly", function () {
            expect(bigInt("50000005000000").times("10000001")).toEqualBigInt("500000100000005000000");

            expect(bigInt(e).times(bigInt(e).times(3))).toEqualBigInt("45724736259716510251486054687700045835025148620128029265675354366933790580730004572476663008688032556012839881115687650663009131321444949757658898638317330230086877059634202109625971651328852309169510745320613625972427617741279387288531601280293526383173389263831742588934614625148605499140374953576588935723914037609016918164564243256822679469718893461375551897577921444901828770004586539551899020210333938646547797527206220118975766048523091008514860541217741198158399634219502514862316506630268276177430490169183415272062378152720641477823504514037494488029263852465477825612802926597905807063453132146711568358707782350274440786467810333790817658893485428440788909099222927535436696416095110007864655037411979907403749431106630087147288523118391403752205395519257165066329379058073304160951367041609540366712394402926383476918152751354366715501691815586794695962342021036600457247696671239173329675357699222679806547782384317329678797988111916424325595304983999896753544026300868806292638320995518976136177412017280292642094284408246053955228267946963193049840355930498439255601284291815272465807041650243255605390580704575683584861230909926489346136685560128072218564247588111568795436671283206218568686877000905313214494193872889785642433015189757705181527210884407865125066300916169181531983173297234942844127156835853081938729344819387338144490174180704161454695930549132144495279469593564572473760119798816378235025674449016971107453137477000457784325560182095107458575765889894202103393082761779674531322004078646604070416100773296754113955189815058070421872062186223831733026045724742970827618333708276237033379064069593050443584819448021033385168358482553461362659008687706267123914663337905869996342027365889346773214449080983996348464654778883090992291971650669563420210992967535502959304990662185643102844078713946959311760951075212720621924934613632859716507322597165135922267953958481939432473708346909922275057247371542350251557897576596156012803652226794768885230917254778235762103337979872885238353543667871979881190860539559452309099981856424401848193880551074532091732967612835848201649839964201609510823823502522748605396311486054034811156843847370828421362597245798811164946136260531239140456786465486044901692641115683667774119807143667124750992226878761774128242432556860868770089749428449341197988970745313300737082770439963421080621856511724737091538728853190498399722712391412637494285300374942933700045733736259717410251486144687700054835025149520128029355675354375933790581630004572566663008697032556013739881115777650663018131321445849757658988638317339230086877959634202199625971660328852310069510745410613625981427617742179387288621601280302526383174289263831832588934623625148606399140375043576588944723914038509016918254564243265822679470618893461465551897586921444902728770004676539551908020210334838646547887527206229118975766948523091098514860550217741199058399634309502514871316506631168276177520490169192415272063278152720731477823513514037495388029263942465477834612802927497905807153453132155711568359607782350364440786476810333791717658893575428440797909099223827535436786416095119007864655937411979997403749440106630088047288523208391403761205395520157165066419379058082304160952267041609630366712403402926384376918152841354366724501691816486794696052342021045600457248596671239263329675366699222680706547782474317329687797988112816424325685304984008896753544926300868896292638329995518977036177412107280292651094284409146053955318267946972193049841255930498529255601293291815273365807041740243255614390580705475683584951230909935489346137585560128162218564256588111569695436671373206218577686877001805313214584193872898785642433915189757795181527219884407866025066301006169181540983173298134942844217156835862081938730244819387428144490183180704162354695930639132144504279469594464572473850119798825378235026574449017061107453146477000458684325560272095107467575765890794202103483082761788674531322904078646694070416109773296755013955189905058070430872062187123831733116045724751970827619233708276327033379073069593051343584819538021033394168358483453461362749008687715267123915563337905959996342036365889347673214449170983996357464654779783090992381971650678563420211892967535592959304999662185644002844078803946959320760951076112720622014934613641859716508222597165225922267962958481940332473708436909922284057247372442350251647897576605156012804552226794858885230926254778236662103338069872885247353543668771979881280860539568452309100881856424491848193889551074532991732967702835848210649839965101609510913823502531748605397211486054124811156852847370829321362597335798811173946136261431239140546786465495044901693541115683757774119816143667125650992226968761774137242432557760868770179749428458341197989870745313390737082779439963421980621856601724737100538728854090498399812712391421637494286200374943023700045742736259718310251486234687700063835025150420128029445675354384933790582530004572656663008706032556014639881115867650663027131321446749757659078638317348230086878859634202289625971669328852310969510745500613625990427617743079387288711601280311526383175189263831922588934632625148607299140375133576588953723914039409016918344564243274822679471518893461555551897595921444903628770004766539551917020210335738646547977527206238118975767848523091188514860559217741199958399634399502514880316506632068276177610490169201415272064178152720821477823522514037496288029264032465477843612802928397905807243453132164711568360507782350454440786485810333792617658893665428440806909099224727535436876416095128007864656837411980087403749449106630088947288523298391403770205395521057165066509379058091304160953167041609720366712412402926385276918152931354366733501691817386794696142342021054600457249496671239353329675375699222681606547782564317329696797988113716424325775304984017896753545826300868986292638338995518977936177412197280292660094284410046053955408267946981193049842155930498619255601302291815274265807041830243255623390580706375683585041230909944489346138485560128252218564265588111570595436671463206218586686877002705313214674193872907785642434815189757885181527228884407866925066301096169181549983173299034942844307156835871081938731144819387518144490192180704163254695930729132144513279469595364572473940119798834378235027474449017151107453155477000459584325560362095107476575765891694202103573082761797674531323804078646784070416118773296755913955189995058070439872062188023831733206045724760970827620133708276417033379082069593052243584819628021033403168358484353461362839008687724267123916463337906049996342045365889348573214449260983996366464654780683090992471971650687563420212792967535682959305008662185644902844078893946959329760951077012720622104934613650859716509122597165315922267971958481941232473708526909922293057247373342350251737897576614156012805452226794948885230935254778237562103338159872885256353543669671979881370860539577452309101781856424581848193898551074533891732967792835848219649839966001609511003823502540748605398111486054214811156861847370830221362597425798811182946136262331239140636786465504044901694441115683847774119825143667126550992227058761774146242432558660868770269749428467341197990770745313480737082788439963422880621856691724737109538728854990498399902712391430637494287100374943113700045751736259719210251486324687700072835025151320128029535675354393933790583430004572746663008715032556015539881115957650663036131321447649757659168638317357230086879759634202379625971678328852311869510745590613625999427617743979387288801601280320526383176089263832012588934641625148608199140375223576588962723914040309016918434564243283822679472418893461645551897604921444904528770004856539551926020210336638646548067527206247118975768748523091278514860568217741200858399634489502514889316506632968276177700490169210415272065078152720911477823531514037497188029264122465477852612802929297905807333453132173711568361407782350544440786494810333793517658893755428440815909099225627535436966416095137007864657737411980177403749458106630089847288523388391403779205395521957165066599379058100304160954067041609810366712421402926386176918153021354366742501691818286794696232342021063600457250396671239443329675384699222682506547782654317329705797988114616424325865304984026896753546726300869076292638347995518978836177412287280292669094284410946053955498267946990193049843055930498709255601311291815275165807041920243255632390580707275683585131230909953489346139385560128342218564274588111571495436671553206218595686877003605313214764193872916785642435715189757975181527237884407867825066301186169181558983173299934942844397156835880081938732044819387608144490201180704164154695930819132144522279469596264572474030119798843378235028374449017241107453164477000460484325560452095107485575765892594202103663082761806674531324704078646874070416127773296756813955190085058070448872062188923831733296045724769970827621033708276507033379091069593053143584819718021033412168358485253461362929008687733267123917363337906139996342054365889349473214449350983996375464654781583090992561971650696563420213692967535772959305017662185645802844078983946959338760951077912720622194934613659859716510022597165405922267980958481942132473708616909922302057247374242350251827897576623156012806352226795038885230944254778238462103338249872885265353543670571979881460860539586452309102681856424671848193907551074534791732967882835848228649839966901609511093823502549748605399011486054304811156870847370831121362597515798811191946136263231239140726786465513044901695341115683937774119834143667127450992227148761774155242432559560868770359749428476341197991670745313570737082797439963423780621856781724737118538728855890498399992712391439637494288000374943203700045760736259720110251486414687700081835025152220128029625675354402933790584330004572836663008724032556016439881116047650663045131321448549757659258638317366230086880659634202469625971687328852312769510745680613626008427617744879387288891601280329526383176989263832102588934650625148609099140375313576588971723914041209016918524564243292822679473318893461735551897613921444905428770004946539551935020210337538646548157527206256118975769648523091368514860577217741201758399634579502514898316506633868276177790490169219415272065978152721001477823540514037498088029264212465477861612802930197905807423453132182711568362307782350634440786503810333794417658893845428440824909099226527535437056416095146007864658637411980267403749467106630090747288523478391403788205395522857165066689379058109304160954967041609900366712430402926387076918153111354366751501691819186794696322342021072600457251296671239533329675393699222683406547782744317329714797988115516424325955304984035896753547626300869166292638356995518979736177412377280292678094284411846053955588267946999193049843955930498799255601320291815276065807042010243255641390580708175683585221230909962489346140285560128432218564283588111572395436671643206218604686877004505313214854193872925785642436615189758065181527246884407868725066301276169181567983173300834942844487156835889081938732944819387698144490210180704165054695930909132144531279469597164572474120119798852378235029274449017331107453173477000461384325560542095107494575765893494202103753082761815674531325604078646964070416136773296757713955190175058070457872062189823831733386045724778970827621933708276597033379100069593054043584819808021033421168358486153461363019008687742267123918263337906229996342063365889350373214449440983996384464654782483090992651971650705563420214592967535862959305026662185646702844079073946959347760951078812720622284934613668859716510922597165495922267989958481943032473708706909922311057247375142350251917897576632156012807252226795128885230953254778239362103338339872885274353543671471979881550860539595452309103581856424761848193916551074535691732967972835848237649839967801609511183823502558748605399911486054394811156879847370832021362597605798811200946136264131239140816786465522044901696241115684027774119843143667128350992227238761774164242432560460868770449749428485341197992570745313660737082806439963424680621856871724737127538728856790498400082712391448637494288900374943293700045769736259721010251486504687700090835025153120128029715675354411933790585230004572926663008733032556017339881116137650663054131321449449757659348638317375230086881559634202559625971696328852313669510745770613626017427617745779387288981601280338526383177889263832192588934659625148609999140375403576588980723914042109016918614564243301822679474218893461825551897622921444906328770005036539551944020210338438646548247527206265118975770548523091458514860586217741202658399634669502514907316506634768276177880490169228415272066878152721091477823549514037498988029264302465477870612802931097905807513453132191711568363207782350724440786512810333795317658893935428440833909099227427535437146416095155007864659537411980357403749476106630091647288523568391403797205395523757165066779379058118304160955867041609990366712439402926387976918153201354366760501691820086794696412342021081600457252196671239623329675402699222684306547782834317329723797988116416424326045304984044896753548526300869256292638365995518980636177412467280292687094284412746053955678267947008193049844855930498889255601329291815276965807042100243255650390580709075683585311230909971489346141185560128522218564292588111573295436671733206218613686877005405313214944193872934785642437515189758155181527255884407869625066301366169181576983173301734942844577156835898081938733844819387788144490219180704165954695930999132144540279469598064572474210119798861378235030174449017421107453182477000462284325560632095107503575765894394202103843082761824674531326504078647054070416145773296758613955190265058070466872062190723831733476045724787970827622833708276687033379109069593054943584819898021033430168358487053461363109008687751267123919163337906319996342072365889351273214449530983996393464654783383090992741971650714563420215492967535952959305035662185647602844079163946959356760951079712720622374934613677859716511822597165585922267998958481943932473708796909922320057247376042350252007897576641156012808152226795218885230962254778240262103338429872885283353543672371979881640860539604452309104481856424851848193925551074536591732968062835848246649839968701609511273823502567748605400811486054484811156888847370832921362597695798811209946136265031239140906786465531044901697141115684117774119852143667129250992227328761774173242432561360868770539749428494341197993470745313750737082815439963425580621856961724737136538728857690498400172712391457637494289800374943383700045778736259721910251486594687700099835025154020128029805675354420933790586130004573016663008742032556018239881116227650663063131321450349757659438638317384230086882459634202649625971705328852314569510745860613626026427617746679387289071601280347526383178789263832282588934668625148610899140375493576588989723914043009016918704564243310822679475118893461915551897631921444907228770005126539551953020210339338646548337527206274118975771448523091548514860595217741203558399634759502514916316506635668276177970490169237415272067778152721181477823558514037499888029264392465477879612802931997905807603453132200711568364107782350814440786521810333796217658894025428440842909099228327535437236416095164007864660437411980447403749485106630092547288523658391403806205395524657165066869379058127304160956767041610080366712448402926388876918153291354366769501691820986794696502342021090600457253096671239713329675411699222685206547782924317329732797988117316424326135304984053896753549426300869346292638374995518981536177412557280292696094284413646053955768267947017193049845755930498979255601338291815277865807042190243255659390580709975683585401230909980489346142085560128612218564301588111574195436671823206218622686877006305313215034193872943785642438415189758245181527264884407870525066301456169181585983173302634942844667156835907081938734744819387878144490228180704166854695931089132144549279469598964572474300119798870378235031074449017511107453191477000463184325560722095107512575765895294202103933082761833674531327404078647144070416154773296759513955190355058070475872062191623831733566045724796970827623733708276777033379118069593055843584819988021033439168358487953461363199008687760267123920063337906409996342081365889352173214449620983996402464654784283090992831971650723563420216392967536042959305044662185648502844079253946959365760951080612720622464934613686859716512722597165675922268007958481944832473708886909922329057247376942350252097897576650156012809052226795308885230971254778241162103338519872885292353543673271979881730860539613452309105381856424941848193934551074537491732968152835848255649839969601609511363823502576748605401711486054574811156897847370833821362597785798811218946136265931239140996786465540044901698041115684207774119861143667130150992227418761774182242432562260868770629749428503341197994370745313840737082824439963426480621857051724737145538728858590498400262712391466637494290700374943473700045787736259722810251486684687700108835025154920128029895675354429933790587030004573106663008751032556019139881116317650663072131321451249757659528638317393230086883359634202739625971714328852315469510745950613626035427617747579387289161601280356526383179689263832372588934677625148611799140375583576588998723914043909016918794564243319822679476018893462005551897640921444908128770005216539551962020210340238646548427527206283118975772348523091638514860604217741204458399634849502514925316506636568276178060490169246415272068678152721271477823567514037500788029264482465477888612802932897905807693453132209711568365007782350904440786530810333797117658894115428440851909099229227535437326416095173007864661337411980537403749494106630093447288523748391403815205395525557165066959379058136304160957667041610170366712457402926389776918153381354366778501691821886794696592342021099600457253996671239803329675420699222686106547783014317329741797988118216424326225304984062896753550326300869436292638383995518982436177412647280292705094284414546053955858267947026193049846655930499069255601347291815278765807042280243255668390580710875683585491230909989489346142985560128702218564310588111575095436671913206218631686877007205313215124193872952785642439315189758335181527273884407871425066301546169181594983173303534942844757156835916081938735644819387968144490237180704167754695931179132144558279469599864572474390119798879378235031974449017601107453200477000464084325560812095107521575765896194202104023082761842674531328304078647234070416163773296760413955190445058070484872062192523831733656045724805970827624633708276867033379127069593056743584820078021033448168358488853461363289008687769267123920963337906499996342090365889353073214449710983996411464654785183090992921971650732563420217292967536132959305053662185649402844079343946959374760951081512720622554934613695859716513622597165765922268016958481945732473708976909922338057247377842350252187897576659156012809952226795398885230980254778242062103338609872885301353543674171979881820860539622452309106281856425031848193943551074538391732968242835848264649839970501609511453823502585748605402611486054664811156906847370834721362597875798811227946136266831239141086786465549044901698941115684297774119870143667131050992227508761774191242432563160868770719749428512341197995270745313930737082833439963427380621857141724737154538728859490498400352712391475637494291600374943563700045796736259723710251486774687700117835025155820128029985675354438933790587930004573196663008760032556020039881116407650663081131321452149757659618638317402230086884259634202829625971723328852316369510746040613626044427617748479387289251601280365526383180589263832462588934686625148612699140375673576589007723914044809016918884564243328822679476918893462095551897649921444909028770005306539551971020210341138646548517527206292118975773248523091728514860613217741205358399634939502514934316506637468276178150490169255415272069578152721361477823576514037501688029264572465477897612802933797905807783453132218711568365907782350994440786539810333798017658894205428440860909099230127535437416416095182007864662237411980627403749503106630094347288523838391403824205395526457165067049379058145304160958567041610260366712466402926390676918153471354366787501691822786794696682342021108600457254896671239893329675429699222687006547783104317329750797988119116424326315304984071896753551226300869526292638392995518983336177412737280292714094284415446053955948267947035193049847555930499159255601356291815279665807042370243255677390580711775683585581230909998489346143885560128792218564319588111575995436672003206218640686877008105313215214193872961785642440215189758425181527282884407872325066301636169181603983173304434942844847156835925081938736544819388058144490246180704168654695931269132144567279469600764572474480119798888378235032874449017691107453209477000464984325560902095107530575765897094202104113082761851674531329204078647324070416172773296761313955190535058070493872062193423831733746045724814970827625533708276957033379136069593057643584820168021033457168358489753461363379008687778267123921863337906589996342099365889353973214449800983996420464654786083090993011971650741563420218192967536222959305062662185650302844079433946959383760951082412720622644934613704859716514522597165855922268025958481946632473709066909922347057247378742350252277897576668156012810852226795488885230989254778242962103338699872885310353543675071979881910860539631452309107181856425121848193952551074539291732968332835848273649839971401609511543823502594748605403511486054754811156915847370835621362597965798811236946136267731239141176786465558044901699841115684387774119879143667131950992227598761774200242432564060868770809749428521341197996170745314020737082842439963428280621857231724737163538728860390498400442712391484637494292500374943653700045805736259724610251486864687700126835025156720128030075675354447933790588830004573286663008769032556020939881116497650663090131321453049757659708638317411230086885159634202919625971732328852317269510746130613626053427617749379387289341601280374526383181489263832552588934695625148613599140375763576589016723914045709016918974564243337822679477818893462185551897658921444909928770005396539551980020210342038646548607527206301118975774148523091818514860622217741206258399635029502514943316506638368276178240490169264415272070478152721451477823585514037502588029264662465477906612802934697905807873453132227711568366807782351084440786548810333798917658894295428440869909099231027535437506416095191007864663137411980717403749512106630095247288523928391403833205395527357165067139379058154304160959467041610350366712475402926391576918153561354366796501691823686794696772342021117600457255796671239983329675438699222687906547783194317329759797988120016424326405304984080896753552126300869616292638401995518984236177412827280292723094284416346053956038267947044193049848455930499249255601365291815280565807042460243255686390580712675683585671230910007489346144785560128882218564328588111576895436672093206218649686877009005313215304193872970785642441115189758515181527291884407873225066301726169181612983173305334942844937156835934081938737444819388148144490255180704169554695931359132144576279469601664572474570119798897378235033774449017781107453218477000465884325560992095107539575765897994202104203082761860674531330104078647414070416181773296762213955190625058070502872062194323831733836045724823970827626433708277047033379145069593058543584820258021033466168358490653461363469008687787267123922763337906679996342108365889354873214449890983996429464654786983090993101971650750563420219092967536312959305071662185651202844079523946959392760951083312720622734934613713859716515422597165945922268034958481947532473709156909922356057247379642350252367897576677156012811752226795578885230998254778243862103338789872885319353543675971979882000860539640452309108081856425211848193961551074540191732968422835848282649839972301609511633823502603748605404411486054844811156924847370836521362598055798811245946136268631239141266786465567044901700741115684477774119888143667132850992227688761774209242432564960868770899749428530341197997070745314110737082851439963429180621857321724737172538728861290498400532712391493637494293400374943743700045814736259725510251486954687700135835025157620128030165675354456933790589730004573376663008778032556021839881116587650663099131321453949757659798638317420230086886059634203009625971741328852318169510746220613626062427617750279387289431601280383526383182389263832642588934704625148614499140375853576589025723914046609016919064564243346822679478718893462275551897667921444910828770005486539551989020210342938646548697527206310118975775048523091908514860631217741207158399635119502514952316506639268276178330490169273415272071378152721541477823594514037503488029264752465477915612802935597905807963453132236711568367707782351174440786557810333799817658894385428440878909099231927535437596416095200007864664037411980807403749521106630096147288524018391403842205395528257165067229379058163304160960367041610440366712484402926392476918153651354366805501691824586794696862342021126600457256696671240073329675447699222688806547783284317329768797988120916424326495304984089896753553026300869706292638410995518985136177412917280292732094284417246053956128267947053193049849355930499339255601374291815281465807042550243255695390580713575683585761230910016489346145685560128972218564337588111577795436672183206218658686877009905313215394193872979785642442015189758605181527300884407874125066301816169181621983173306234942845027156835943081938738344819388238144490264180704170454695931449132144585279469602564572474660119798906378235034674449017871107453227477000466784325561082095107548575765898894202104293082761869674531331004078647504070416190773296763113955190715058070511872062195223831733926045724832970827627333708277137033379154069593059443584820348021033475168358491553461363559008687796267123923663337906769996342117365889355773214449980983996438464654787883090993191971650759563420219992967536402959305080662185652102844079613946959401760951084212720622824934613722859716516322597166035922268043958481948432473709246909922365057247380542350252457897576686156012812652226795668885231007254778244762103338879872885328353543676871979882090860539649452309108981856425301848193970551074541091732968512835848291649839973201609511723823502612748605405311486054934811156933847370837421362598145798811254946136269531239141356786465576044901701641115684567774119897143667133750992227778761774218242432565860868770989749428539341197997970745314200737082860439963430080621857411724737181538728862190498400622712391502637494294300374943833700045823736259726410251487044687700144835025158520128030255675354465933790590630004573466663008787032556022739881116677650663108131321454849757659888638317429230086886959634203099625971750328852319069510746310613626071427617751179387289521601280392526383183289263832732588934713625148615399140375943576589034723914047509016919154564243355822679479618893462365551897676921444911728770005576539551998020210343838646548787527206319118975775948523091998514860640217741208058399635209502514961316506640168276178420490169282415272072278152721631477823603514037504388029264842465477924612802936497905808053453132245711568368607782351264440786566810333800717658894475428440887909099232827535437686416095209007864664937411980897403749530106630097047288524108391403851205395529157165067319379058172304160961267041610530366712493402926393376918153741354366814501691825486794696952342021135600457257596671240163329675456699222689706547783374317329777797988121816424326585304984098896753553926300869796292638419995518986036177413007280292741094284418146053956218267947062193049850255930499429255601383291815282365807042640243255704390580714475683585851230910025489346146585560129062218564346588111578695436672273206218667686877010805313215484193872988785642442915189758695181527309884407875025066301906169181630983173307134942845117156835952081938739244819388328144490273180704171354695931539132144594279469603464572474750119798915378235035574449017961107453236477000467684325561172095107557575765899794202104383082761878674531331904078647594070416199773296764013955190805058070520872062196123831734016045724841970827628233708277227033379163069593060343584820438021033484168358492453461363649008687805267123924563337906859996342126365889356673214450070983996447464654788783090993281971650768563420220892967536492959305089662185653002844079703946959410760951085112720622914934613731859716517222597166125922268052958481949332473709336909922374057247381442350252547897576695156012813552226795758885231016254778245662103338969872885337353543677771979882180860539658452309109881856425391848193979551074541991732968602835848300649839974101609511813823502621748605406211486055024811156942847370838321362598235798811263946136270431239141446786465585044901702541115684657774119906143667134650992227868761774227242432566760868771079749428548341197998870745314290737082869439963430980621857501724737190538728863090498400712712391511637494295200374943923700045832736259727310251487134687700153835025159420128030345675354474933790591530004573556663008796032556023639881116767650663117131321455749757659978638317438230086887859634203189625971759328852319969510746400613626080427617752079387289611601280401526383184189263832822588934722625148616299140376033576589043723914048409016919244564243364822679480518893462455551897685921444912628770005666539552007020210344738646548877527206328118975776848523092088514860649217741208958399635299502514970316506641068276178510490169291415272073178152721721477823612514037505288029264932465477933612802937397905808143453132254711568369507782351354440786575810333801617658894565428440896909099233727535437776416095218007864665837411980987403749539106630097947288524198391403860205395530057165067409379058181304160962167041610620366712502402926394276918153831354275374029172393366291724932966621052930406961256415181721978966731831641529146538638510991312410732876097036662095300003658089634110664926785552089016003768535345232816909008878028349447436579800707032465667040695126337814368597155922456053040805239048936487279379245065386484140283504377402836034077732163041518072267526292823090077841942752640157649749612102423520843987208047773206401114769199745221775937896663190127114878646456343828020119979139460557547690911718143576768151806236448925479608267033557164151915350160047498390490346176497594251394615388513947135188843273152629183278637403924201188952053863751168760860713213534630955098319058884317502225880309856332886949007774291238225988757567454839131231080250571667658802022729254687869262917346560036590619378144658275263025461271158509501601447287608704362505726399625058236299954383263740294289748515025312300062164974862179871971814324645741066209430069995428603336991419967443997960118885392349337098868678565850242342181361682777769913133740365798970374028456671147701630489255759386374135572382269520612712548398719814473616837410736169337411065493374851405300859626126423411172276085973190983082915435756851177320541081106539704448102530078555108971229996493460448208979789676861353453282472793887881024244751476910071485139566782258812641600366860497485245683493380531723823649509830924584727948421847280438522176603485962516311970737227534522282387197084202094194016546867961288431652092217650805559213640189666219982341107594571559319090900787872464564383583904997992135355762588021172596250676893369923652711477961608596355794604491542834934750620942034695839059432958391539633287713597073627323081848328645633392498308195213205305117657979071399542763103328761906670324750300777330993452218695682670429202011898883575675484695016108103246466773699132273707361787004481034663822589062719707465905715602553946045851732053144806950170444069502640744398823708184738334192959429756744502609419306224316416218769090181510653874114439873007781435860411888442004563329796793781539313123009894686786585806127218214357577784810243374818472897115592145674933700163830818576016826713565057156952843164254918061281455180613741855509933819295849345304070530867855612720530417235427527319880201291621764985125550984108892546970522999553015674440897904892649424234120905797897686917238328325468688795921354475929584007226703256686044811264941929686127937824576168268053954275365029172392466291724842966621043930406960356415181631978966722831641528246538638420991312401732876096136662095210003658080634110664026785551999016003759535345231916909008788028349438436579799807032465577040695117337814367697155922366053040796239048935587279379155065386475140283503477402835944077732154041518071367526292733090077832942752639257649749522102423511843987207147773206311114769190745221775037896663100127114869646456342928020119889139460548547690910818143576678151806227448925478708267033467164151906350160046598390490256176497585251394614488513947045188843264152629182378637403834201188943053863750268760860623213534621955098318158884317412225880300856332886049007774201238225979757567453939131230990250571658658802021829254687779262917337560036589719378144568275263016461271157609501601357287608695362505725499625058146299954374263740293389748514935312300053164974861279871971724324645732066209429169995428513336991410967443997060118885302349337089868678564950242342091361682768769913132840365798880374028447671147700730489255669386374126572382268620612712458398719805473616836510736169247411065484374851404400859626036423411163276085972290983082825435756842177320540181106539614448102521078555108071229996403460448199979789675961353453192472793878881024243851476909981485139557782258811741600366770497485236683493379631723823559509830915584727947521847280348522176594485962515411970737137534522273387197083302094193926546867952288431651192217650715559213631189666219082341107504571559310090900786972464564293583904988992135354862588021082596250667893369922752711477871608596346794604490642834934660620942025695839058532958391449633287704597073626423081848238645633383498308194313205305027657979062399542762203328761816670324741300777330093452218605682670420202011897983575675394695016099103246465873699132183707361778004481033763822588972719707456905715601653946045761732053135806950169544069502550744398814708184737434192959339756744493609419305324316416128769090172510653873214439872917781435851411888441104563329706793781530313123008994686786495806127209214357576884810243284818472888115592144774933700073830818567016826712665057156862843164245918061280555180613651855509924819295848445304070440867855603720530416335427527229880201282621764984225550984018892546961522999552115674440807904892640424234120005797897596917238319325468687895921354385929583998226703255786044811174941929677127937823676168267963954275356029172391566291724752966621034930406959456415181541978966713831641527346538638330991312392732876095236662095120003658071634110663126785551909016003750535345231016909008698028349429436579798907032465487040695108337814366797155922276053040787239048934687279379065065386466140283502577402835854077732145041518070467526292643090077823942752638357649749432102423502843987206247773206221114769181745221774137896663010127114860646456342028020119799139460539547690909918143576588151806218448925477808267033377164151897350160045698390490166176497576251394613588513946955188843255152629181478637403744201188934053863749368760860533213534612955098317258884317322225880291856332885149007774111238225970757567453039131230900250571649658802020929254687689262917328560036588819378144478275263007461271156709501601267287608686362505724599625058056299954365263740292489748514845312300044164974860379871971634324645723066209428269995428423336991401967443996160118885212349337080868678564050242342001361682759769913131940365798790374028438671147699830489255579386374117572382267720612712368398719796473616835610736169157411065475374851403500859625946423411154276085971390983082735435756833177320539281106539524448102512078555107171229996313460448190979789675061353453102472793869881024242951476909891485139548782258810841600366680497485227683493378731723823469509830906584727946621847280258522176585485962514511970737047534522264387197082402094193836546867943288431650292217650625559213622189666218182341107414571559301090900786072464564203583904979992135353962588020992596250658893369921852711477781608596337794604489742834934570620942016695839057632958391359633287695597073625523081848148645633374498308193413205304937657979053399542761303328761726670324732300777329193452218515682670411202011897083575675304695016090103246464973699132093707361769004481032863822588882719707447905715600753946045671732053126806950168644069502460744398805708184736534192959249756744484609419304424316416038769090163510653872314439872827781435842411888440204563329616793781521313123008094686786405806127200214357575984810243194818472879115592143874933699983830818558016826711765057156772843164236918061279655180613561855509915819295847545304070350867855594720530415435427527139880201273621764983325550983928892546952522999551215674440717904892631424234119105797897506917238310325468686995921354295929583989226703254886044811084941929668127937822776168267873954275347029172390666291724662966621025930406958556415181451978966704831641526446538638240991312383732876094336662095030003658062634110662226785551819016003741535345230116909008608028349420436579798007032465397040695099337814365897155922186053040778239048933787279378975065386457140283501677402835764077732136041518069567526292553090077814942752637457649749342102423493843987205347773206131114769172745221773237896662920127114851646456341128020119709139460530547690909018143576498151806209448925476908267033287164151888350160044798390490076176497567251394612688513946865188843246152629180578637403654201188925053863748468760860443213534603955098316358884317232225880282856332884249007774021238225961757567452139131230810250571640658802020029254687599262917319560036587919378144388275262998461271155809501601177287608677362505723699625057966299954356263740291589748514755312300035164974859479871971544324645714066209427369995428333336991392967443995260118885122349337071868678563150242341911361682750769913131040365798700374028429671147698930489255489386374108572382266820612712278398719787473616834710736169067411065466374851402600859625856423411145276085970490983082645435756824177320538381106539434448102503078555106271229996223460448181979789674161353453012472793860881024242051476909801485139539782258809941600366590497485218683493377831723823379509830897584727945721847280168522176576485962513611970736957534522255387197081502094193746546867934288431649392217650535559213613189666217282341107324571559292090900785172464564113583904970992135353062588020902596250649893369920952711477691608596328794604488842834934480620942007695839056732958391269633287686597073624623081848058645633365498308192513205304847657979044399542760403328761636670324723300777328293452218425682670402202011896183575675214695016081103246464073699132003707361760004481031963822588792719707438905715599853946045581732053117806950167744069502370744398796708184735634192959159756744475609419303524316415948769090154510653871414439872737781435833411888439304563329526793781512313123007194686786315806127191214357575084810243104818472870115592142974933699893830818549016826710865057156682843164227918061278755180613471855509906819295846645304070260867855585720530414535427527049880201264621764982425550983838892546943522999550315674440627904892622424234118205797897416917238301325468686095921354205929583980226703253986044810994941929659127937821876168267783954275338029172389766291724572966621016930406957656415181361978966695831641525546538638150991312374732876093436662094940003658053634110661326785551729016003732535345229216909008518028349411436579797107032465307040695090337814364997155922096053040769239048932887279378885065386448140283500777402835674077732127041518068667526292463090077805942752636557649749252102423484843987204447773206041114769163745221772337896662830127114842646456340228020119619139460521547690908118143576408151806200448925476008267033197164151879350160043898390489986176497558251394611788513946775188843237152629179678637403564201188916053863747568760860353213534594955098315458884317142225880273856332883349007773931238225952757567451239131230720250571631658802019129254687509262917310560036587019378144298275262989461271154909501601087287608668362505722799625057876299954347263740290689748514665312300026164974858579871971454324645705066209426469995428243336991383967443994360118885032349337062868678562250242341821361682741769913130140365798610374028420671147698030489255399386374099572382265920612712188398719778473616833810736168977411065457374851401700859625766423411136276085969590983082555435756815177320537481106539344448102494078555105371229996133460448172979789673261353452922472793851881024241151476909711485139530782258809041600366500497485209683493376931723823289509830888584727944821847280078522176567485962512711970736867534522246387197080602094193656546867925288431648492217650445559213604189666216382341107234571559283090900784272464564023583904961992135352162588020812596250640893369920052711477601608596319794604487942834934390620941998695839055832958391179633287677597073623723081847968645633356498308191613205304757657979035399542759503328761546670324714300777327393452218335682670393202011895283575675124695016072103246463173699131913707361751004481031063822588702719707429905715598953946045491732053108806950166844069502280744398787708184734734192959069756744466609419302624316415858769090145510653870514439872647781435824411888438404563329436793781503313123006294686786225806127182214357574184810243014818472861115592142074933699803830818540016826709965057156592843164218918061277855180613381855509897819295845745304070170867855576720530413635427526959880201255621764981525550983748892546934522999549415674440537904892613424234117305797897326917238292325468685195921354115929583971226703253086044810904941929650127937820976168267693954275329029172388866291724482966621007930406956756415181271978966686831641524646538638060991312365732876092536662094850003658044634110660426785551639016003723535345228316909008428028349402436579796207032465217040695081337814364097155922006053040760239048931987279378795065386439140283499877402835584077732118041518067767526292373090077796942752635657649749162102423475843987203547773205951114769154745221771437896662740127114833646456339328020119529139460512547690907218143576318151806191448925475108267033107164151870350160042998390489896176497549251394610888513946685188843228152629178778637403474201188907053863746668760860263213534585955098314558884317052225880264856332882449007773841238225943757567450339131230630250571622658802018229254687419262917301560036586119378144208275262980461271154009501600997287608659362505721899625057786299954338263740289789748514575312300017164974857679871971364324645696066209425569995428153336991374967443993460118884942349337053868678561350242341731361682732769913129240365798520374028411671147697130489255309386374090572382265020612712098398719769473616832910736168887411065448374851400800859625676423411127276085968690983082465435756806177320536581106539254448102485078555104471229996043460448163979789672361353452832472793842881024240251476909621485139521782258808141600366410497485200683493376031723823199509830879584727943921847279988522176558485962511811970736777534522237387197079702094193566546867916288431647592217650355559213595189666215482341107144571559274090900783372464563933583904952992135351262588020722596250631893369919152711477511608596310794604487042834934300620941989695839054932958391089633287668597073622823081847878645633347498308190713205304667657979026399542758603328761456670324705300777326493452218245682670384202011894383575675034695016063103246462273699131823707361742004481030163822588612719707420905715598053946045401732053099806950165944069502190744398778708184733834192958979756744457609419301724316415768769090136510653869614439872557781435815411888437504563329346793781494313123005394686786135806127173214357573284810242924818472852115592141174933699713830818531016826709065057156502843164209918061276955180613291855509888819295844845304070080867855567720530412735427526869880201246621764980625550983658892546925522999548515674440447904892604424234116405797897236917238283325468684295921354025929583962226703252186044810814941929641127937820076168267603954275320029172387966291724392966620998930406955856415181181978966677831641523746538637970991312356732876091636662094760003658035634110659526785551549016003714535345227416909008338028349393436579795307032465127040695072337814363197155921916053040751239048931087279378705065386430140283498977402835494077732109041518066867526292283090077787942752634757649749072102423466843987202647773205861114769145745221770537896662650127114824646456338428020119439139460503547690906318143576228151806182448925474208267033017164151861350160042098390489806176497540251394609988513946595188843219152629177878637403384201188898053863745768760860173213534576955098313658884316962225880255856332881549007773751238225934757567449439131230540250571613658802017329254687329262917292560036585219378144118275262971461271153109501600907287608650362505720999625057696299954329263740288889748514485312300008164974856779871971274324645687066209424669995428063336991365967443992560118884852349337044868678560450242341641361682723769913128340365798430374028402671147696230489255219386374081572382264120612712008398719760473616832010736168797411065439374851399900859625586423411118276085967790983082375435756797177320535681106539164448102476078555103571229995953460448154979789671461353452742472793833881024239351476909531485139512782258807241600366320497485191683493375131723823109509830870584727943021847279898522176549485962510911970736687534522228387197078802094193476546867907288431646692217650265559213586189666214582341107054571559265090900782472464563843583904943992135350362588020632596250622893369918252711477421608596301794604486142834934210620941980695839054032958390999633287659597073621923081847788645633338498308189813205304577657979017399542757703328761366670324696300777325593452218155682670375202011893483575674944695016054103246461373699131733707361733004481029263822588522719707411905715597153946045311732053090806950165044069502100744398769708184732934192958889756744448609419300824316415678769090127510653868714439872467781435806411888436604563329256793781485313123004494686786045806127164214357572384810242834818472843115592140274933699623830818522016826708165057156412843164200918061276055180613201855509879819295843945304069990867855558720530411835427526779880201237621764979725550983568892546916522999547615674440357904892595424234115505797897146917238274325468683395921353935929583953226703251286044810724941929632127937819176168267513954275311029172387066291724302966620989930406954956415181091978966668831641522846538637880991312347732876090736662094670003658026634110658626785551459016003705535345226516909008248028349384436579794407032465037040695063337814362297155921826053040742239048930187279378615065386421140283498077402835404077732100041518065967526292193090077778942752633857649748982102423457843987201747773205771114769136745221769637896662560127114815646456337528020119349139460494547690905418143576138151806173448925473308267032927164151852350160041198390489716176497531251394609088513946505188843210152629176978637403294201188889053863744868760860083213534567955098312758884316872225880246856332880649007773661238225925757567448539131230450250571604658802016429254687239262917283560036584319378144028275262962461271152209501600817287608641362505720099625057606299954320263740287989748514395312299999164974855879871971184324645678066209423769995427973336991356967443991660118884762349337035868678559550242341551361682714769913127440365798340374028393671147695330489255129386374072572382263220612711918398719751473616831110736168707411065430374851399000859625496423411109276085966890983082285435756788177320534781106539074448102467078555102671229995863460448145979789670561353452652472793824881024238451476909441485139503782258806341600366230497485182683493374231723823019509830861584727942121847279808522176540485962510011970736597534522219387197077902094193386546867898288431645792217650175559213577189666213682341106964571559256090900781572464563753583904934992135349462588020542596250613893369917352711477331608596292794604485242834934120620941971695839053132958390909633287650597073621023081847698645633329498308188913205304487657979008399542756803328761276670324687300777324693452218065682670366202011892583575674854695016045103246460473699131643707361724004481028363822588432719707402905715596253946045221732053081806950164144069502010744398760708184732034192958799756744439609419299924316415588769090118510653867814439872377781435797411888435704563329166793781476313123003594686785955806127155214357571484810242744818472834115592139374933699533830818513016826707265057156322843164191918061275155180613111855509870819295843045304069900867855549720530410935427526689880201228621764978825550983478892546907522999546715674440267904892586424234114605797897056917238265325468682495921353845929583944226703250386044810634941929623127937818276168267423954275302029172386166291724212966620980930406954056415181001978966659831641521946538637790991312338732876089836662094580003658017634110657726785551369016003696535345225616909008158028349375436579793507032464947040695054337814361397155921736053040733239048929287279378525065386412140283497177402835314077732091041518065067526292103090077769942752632957649748892102423448843987200847773205681114769127745221768737896662470127114806646456336628020119259139460485547690904518143576048151806164448925472408267032837164151843350160040298390489626176497522251394608188513946415188843201152629176078637403204201188880053863743968760859993213534558955098311858884316782225880237856332879749007773571238225916757567447639131230360250571595658802015529254687149262917274560036583419378143938275262953461271151309501600727287608632362505719199625057516299954311263740287089748514305312299990164974854979871971094324645669066209422869995427883336991347967443990760118884672349337026868678558650242341461361682705769913126540365798250374028384671147694430489255039386374063572382262320612711828398719742473616830210736168617411065421374851398100859625406423411100276085965990983082195435756779177320533881106538984448102458078555101771229995773460448136979789669661353452562472793815881024237551476909351485139494782258805441600366140497485173683493373331723822929509830852584727941221847279718522176531485962509111970736507534522210387197077002094193296546867889288431644892217650085559213568189666212782341106874571559247090900780672464563663583904925992135348562588020452596250604893369916452711477241608596283794604484342834934030620941962695839052232958390819633287641597073620123081847608645633320498308188013205304397657978999399542755903328761186670324678300777323793452217975682670357202011891683575674764695016036103246459573699131553707361715004481027463822588342719707393905715595353946045131732053072806950163244069501920744398751708184731134192958709756744430609419299024316415498769090109510653866914439872287781435788411888434804563329076793781467313123002694686785865806127146214357570584810242654818472825115592138474933699443830818504016826706365057156232843164182918061274255180613021855509861819295842145304069810867855540720530410035427526599880201219621764977925550983388892546898522999545815674440177904892577424234113705797896966917238256325468681595921353755929583935226703249486044810544941929614127937817376168267333954275293029172385266291724122966620971930406953156415180911978966650831641521046538637700991312329732876088936662094490003658008634110656826785551279016003687535345224716909008068028349366436579792607032464857040695045337814360497155921646053040724239048928387279378435065386403140283496277402835224077732082041518064167526292013090077760942752632057649748802102423439843987199947773205591114769118745221767837896662380127114797646456335728020119169139460476547690903618143575958151806155448925471508267032747164151834350160039398390489536176497513251394607288513946325188843192152629175178637403114201188871053863743068760859903213534549955098310958884316692225880228856332878849007773481238225907757567446739131230270250571586658802014629254687059262917265560036582519378143848275262944461271150409501600637287608623362505718299625057426299954302263740286189748514215312299981164974854079871971004324645660066209421969995427793336991338967443989860118884582349337017868678557750242341371361682696769913125640365798160374028375671147693530489254949386374054572382261420612711738398719733473616829310736168527411065412374851397200859625316423411091276085965090983082105435756770177320532981106538894448102449078555100871229995683460448127979789668761353452472472793806881024236651476909261485139485782258804541600366050497485164683493372431723822839509830843584727940321847279628522176522485962508211970736417534522201387197076102094193206546867880288431643992217649995559213559189666211882341106784571559238090900779772464563573583904916992135347662588020362596250595893369915552711477151608596274794604483442834933940620941953695839051332958390729633287632597073619223081847518645633311498308187113205304307657978990399542755003328761096670324669300777322893452217885682670348202011890783575674674695016027103246458673699131463707361706004481026563822588252719707384905715594453946045041732053063806950162344069501830744398742708184730234192958619756744421609419298124316415408769090100510653866014439872197781435779411888433904563328986793781458313123001794686785775806127137214357569684810242564818472816115592137574933699353830818495016826705465057156142843164173918061273355180612931855509852819295841245304069720867855531720530409135427526509880201210621764977025550983298892546889522999544915674440087904892568424234112805797896876917238247325468680695921353665929583926226703248586044810454941929605127937816476168267243954275284029172384366291724032966620962930406952256415180821978966641831641520146538637610991312320732876088036662094400003657999634110655926785551189016003678535345223816909007978028349357436579791707032464767040695036337814359597155921556053040715239048927487279378345065386394140283495377402835134077732073041518063267526291923090077751942752631157649748712102423430843987199047773205501114769109745221766937896662290127114788646456334828020119079139460467547690902718143575868151806146448925470608267032657164151825350160038498390489446176497504251394606388513946235188843183152629174278637403024201188862053863742168760859813213534540955098310058884316602225880219856332877949007773391238225898757567445839131230180250571577658802013729254686969262917256560036581619378143758275262935461271149509501600547287608614362505717399625057336299954293263740285289748514125312299972164974853179871970914324645651066209421069995427703336991329967443988960118884492349337008868678556850242341281361682687769913124740365798070374028366671147692630489254859386374045572382260520612711648398719724473616828410736168437411065403374851396300859625226423411082276085964190983082015435756761177320532081106538804448102440078555099971229995593460448118979789667861353452382472793797881024235751476909171485139476782258803641600365960497485155683493371531723822749509830834584727939421847279538522176513485962507311970736327534522192387197075202094193116546867871288431643092217649905559213550189666210982341106694571559229090900778872464563483583904907992135346762588020272596250586893369914652711477061608596265794604482542834933850620941944695839050432958390639633287623597073618323081847428645633302498308186213205304217657978981399542754103328761006670324660300777321993452217795682670339202011889883575674584695016018103246457773699131373707361697004481025663822588162719707375905715593553946044951732053054806950161444069501740744398733708184729334192958529756744412609419297224316415318769090091510653865114439872107781435770411888433004563328896793781449313123000894686785685806127128214357568784810242474818472807115592136674933699263830818486016826704565057156052843164164918061272455180612841855509843819295840345304069630867855522720530408235427526419880201201621764976125550983208892546880522999544015674439997904892559424234111905797896786917238238325468679795921353575929583917226703247686044810364941929596127937815576168267153954275275029172383466291723942966620953930406951356415180731978966632831641519246538637520991312311732876087136662094310003657990634110655026785551099016003669535345222916909007888028349348436579790807032464677040695027337814358697155921466053040706239048926587279378255065386385140283494477402835044077732064041518062367526291833090077742942752630257649748622102423421843987198147773205411114769100745221766037896662200127114779646456333928020118989139460458547690901818143575778151806137448925469708267032567164151816350160037598390489356176497495251394605488513946145188843174152629173378637402934201188853053863741268760859723213534531955098309158884316512225880210856332877049007773301238225889757567444939131230090250571568658802012829254686879262917247560036580719378143668275262926461271148609501600457287608605362505716499625057246299954284263740284389748514035312299963164974852279871970824324645642066209420169995427613336991320967443988060118884402349336999868678555950242341191361682678769913123840365797980374028357671147691730489254769386374036572382259620612711558398719715473616827510736168347411065394374851395400859625136423411073276085963290983081925435756752177320531181106538714448102431078555099071229995503460448109979789666961353452292472793788881024234851476909081485139467782258802741600365870497485146683493370631723822659509830825584727938521847279448522176504485962506411970736237534522183387197074302094193026546867862288431642192217649815559213541189666210082341106604571559220090900777972464563393583904898992135345862588020182596250577893369913752711476971608596256794604481642834933760620941935695839049532958390549633287614597073617423081847338645633293498308185313205304127657978972399542753203328760916670324651300777321093452217705682670330202011888983575674494695016009103246456873699131283707361688004481024763822588072719707366905715592653946044861732053045806950160544069501650744398724708184728434192958439756744403609419296324316415228769090082510653864214439872017781435761411888432104563328806793781440313122999994686785595806127119214357567884810242384818472798115592135774933699173830818477016826703665057155962843164155918061271555180612751855509834819295839445304069540867855513720530407335427526329880201192621764975225550983118892546871522999543115674439907904892550424234111005797896696917238229325468678895921353485929583908226703246786044810274941929587127937814676168267063954275266029172382566291723852966620944930406950456415180641978966623831641518346538637430991312302732876086236662094220003657981634110654126785551009016003660535345222016909007798028349339436579789907032464587040695018337814357797155921376053040697239048925687279378165065386376140283493577402834954077732055041518061467526291743090077733942752629357649748532102423412843987197247773205321114769091745221765137896662110127114770646456333028020118899139460449547690900918143575688151806128448925468808267032477164151807350160036698390489266176497486251394604588513946055188843165152629172478637402844201188844053863740368760859633213534522955098308258884316422225880201856332876149007773211238225880757567444039131230000250571559658802011929254686789262917238560036579819378143578275262917461271147709501600367287608596362505715599625057156300");

            // See pull request #21
            //   https://github.com/peterolson/BigInteger.js/pull/21
            expect(bigInt("50000005000000").times("10000001")).toEqualBigInt("500000100000005000000");
        });
    });

    describe("Division", function () {
        it("by 1 is the identity", function () {
            expect(bigInt(1).over(1)).toEqualBigInt(1);
            expect(bigInt(-1).over(1)).toEqualBigInt(-1);
            expect(bigInt(1).over(-1)).toEqualBigInt(-1);
            expect(bigInt(153).over(1)).toEqualBigInt(153);
            expect(bigInt(-153).over(1)).toEqualBigInt(-153);
            expect(bigInt("9844190321790980841789").over(1)).toEqualBigInt("9844190321790980841789");
            expect(bigInt("-9844190321790980841789").over(1)).toEqualBigInt("-9844190321790980841789");
        });

        it("by self is 1", function () {
            expect(bigInt(5).over(5)).toEqualBigInt(1);
            expect(bigInt(-5).over(-5)).toEqualBigInt(1);
            expect(bigInt("20194965098495006574").over("20194965098495006574")).toEqualBigInt(1);
            expect(bigInt("-20194965098495006574").over("-20194965098495006574")).toEqualBigInt(1);
        });

        it("by 0 throws an error", function () {
            expect(function () {
                bigInt(0).over(0);
            }).toThrow();
            expect(function () {
                bigInt(-0).over(0);
            }).toThrow();
            expect(function () {
                bigInt(5).over(0);
            }).toThrow();
            expect(function () {
                bigInt(-5).over(0);
            }).toThrow();
            expect(function () {
                bigInt("9549841598749874951041").over(0);
            }).toThrow();
            expect(function () {
                bigInt("-20964918940987496110974948").over(0);
            }).toThrow();
        });

        it("of 0 equals 0", function () {
            expect(bigInt(0).over(1)).toEqualBigInt(0);
            expect(bigInt(-0).over(1)).toEqualBigInt(0);
            expect(bigInt(-0).over("1234567890987654321")).toEqualBigInt(0);
            expect(bigInt(0).over("-1234567890987654321")).toEqualBigInt(0);
        });

        it("handles signs correctly", function () {
            expect(bigInt(10000).over(100)).toEqualBigInt(100);
            expect(bigInt(10000).over(-100)).toEqualBigInt(-100);
            expect(bigInt(-10000).over(100)).toEqualBigInt(-100);
            expect(bigInt(-10000).over(-100)).toEqualBigInt(100);
            expect(bigInt(100).over(-1000)).toEqualBigInt(0);

            expect(bigInt("163500573666152634716420931676158").over(13579)).toEqualBigInt("12040693251797086288859336598");
            expect(bigInt("163500573666152634716420931676158").over(-13579)).toEqualBigInt("-12040693251797086288859336598");
            expect(bigInt("-163500573666152634716420931676158").over(13579)).toEqualBigInt("-12040693251797086288859336598");
            expect(bigInt("-163500573666152634716420931676158").over(-13579)).toEqualBigInt("12040693251797086288859336598");

            expect(bigInt("1234567890987654321").over("132435465768798")).toEqualBigInt("9322");
            expect(bigInt("1234567890987654321").over("-132435465768798")).toEqualBigInt("-9322");
            expect(bigInt("-1234567890987654321").over("132435465768798")).toEqualBigInt("-9322");
            expect(bigInt("-1234567890987654321").over("-132435465768798")).toEqualBigInt("9322");

            expect(bigInt("786456456335437356436").over("-5423424653")).toEqualBigInt("-145011041298");
            expect(bigInt("-93453764643534523").over("-2342")).toEqualBigInt("39903400787162");
            expect(bigInt("10000000000000000").divide("-10000000000000000")).toEqualBigInt(-1);

            expect(bigInt("98789789419609840614360398703968368740365403650364036403645046").over(-1)).toEqualBigInt("-98789789419609840614360398703968368740365403650364036403645046");
        });

        it("works", function () {
            expect(bigInt("98109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241981098409840984091564810684565416840659648198410651068657103974645132104164354016450306480360340639740650049510942094209420974219704902741950491209742109742097421902740927404920974209298924909742022419810984098409840915648106845654168406596481984106510686571039746451321041643540164503064803603406397406500495109420942094209742197049027419504912097421097420974219027409274049209742092989249097420224198109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241981098409840984091564810684565416840659648198410651068657103974645132104164354016450306480360340639740650049510942094209420974219704902741950491209742109742097421902740927404920974209298924909742022419810984098409840915648106845654168406596481984106510686571039746451321041643540164503064803603406397406500495109420942094209742197049027419504912097421097420974219027409274049209742092989249097420224198109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241981098409840984091564810684565416840659648198410651068657103974645132104164354016450306480360340639740650049510942094209420974219704902741950491209742109742097421902740927404920974209298924909742022419810984098409840915648106845654168406596481984106510686571039746451321041643540164503064803603406397406500495109420942094209742197049027419504912097421097420974219027409274049209742092989249097420224198109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241").over("98109840984098409156481068456541684065964819841065106865710397464513210416435401645030648036034063974065004951094209420942097421970490274195049120974210974209742190274092740492097420929892490974202241")).toEqualBigInt("1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001");
            expect(bigInt(e).over(d)).toEqualBigInt("100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001");
            expect(bigInt("1e1050").over("1e1000")).toEqualBigInt("1e50");
            expect(bigInt("650891045068740450350436540352434350243346254305240433565403624570436542564034355230360437856406345450735366803660233645540323657640436735034636550432635454032364560324366403643455063652403346540263364032643454530236455402336455640363263405423565405623454062354540326564062306456432664546654436564364556406435460643646363545606345066534456065340165344065234064564").over("2634565230452364554234565062345452365450236455423654456253445652344565423655423655462534506253450462354056523445062535462534052654350426355023654540625344056203455402635454026435501635446643754664546780646476442344654465764466744566754436556406235454066354570657548036545465")).toEqualBigInt("247058238507527885509216194910087226997858456323482112332514020694766925604284002588230023");
            expect(bigInt("650891045068740450350436540352434350243346254305240433565403624570436542564034355230360437856406345450735366803660233645540323657640436735034636550432635454032364560324366403643455063652403346540263364032643454530236455402336455640363263405423565405623454062354540326564062306456432664546654436564364556406435460643646363545606345066534456065340165344065234064564000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000").over("2634565230452364554234565062345452365450236455423654456253445652344565423655423655462534506253450462354056523445062535462534052654350426355023654540625344056203455402635454026435501635446643754664546780646476442344654465764466744566754436556406235454066354570657548036545465000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).toEqualBigInt("247058238507527885509216194910087226997858456323482112332514020694766925604284002588230023");
            expect(bigInt("9999999999999900000000000000").divide("999999999999990000001")).toEqualBigInt("9999999"); // issue #58
            expect(bigInt("1e9999").over("1e999")).toEqualBigInt("1e9000"); // issue #88
        });
    });

    describe("Modulo", function () {
        it("0 throws error", function () {
            expect(function () {
                bigInt(0).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(-0).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(5).mod(0);
            }).toThrow();
            expect(function () {
                bigInt(-5).mod(0);
            }).toThrow();
            expect(function () {
                bigInt("9549841598749874951041").mod(0);
            }).toThrow();
            expect(function () {
                bigInt("-20964918940987496110974948").mod(0);
            }).toThrow();
        });

        it("handles signs correctly", function () {
            expect(bigInt(124234233).mod(2)).toEqualBigInt(1);
            expect(bigInt(124234233).mod(-2)).toEqualBigInt(1);
            expect(bigInt(-124234233).mod(2)).toEqualBigInt(-1);
            expect(bigInt(-124234233).mod(-2)).toEqualBigInt(-1);
            expect(bigInt(2).mod(-1243233)).toEqualBigInt(2);
            expect(bigInt(-2).mod(-1243233)).toEqualBigInt(-2);

            expect(bigInt("786456456335437356436").mod("-5423424653")).toEqualBigInt("2663036842");
            expect(bigInt("93453764643534523").mod(-2342)).toEqualBigInt(1119);
            expect(bigInt(-32542543).mod(100000000)).toEqualBigInt(-32542543);
        });
    });

    xdescribe("Power", function () {
        it("of 0 to 0 is 1 (mathematically debatable, but matches JavaScript behavior)", function () {
            expect(bigInt(0).pow(0)).toEqualBigInt(1);
            expect(bigInt(0).pow("-0")).toEqualBigInt(1);
            expect(bigInt("-0").pow(0)).toEqualBigInt(1);
            expect(bigInt("-0").pow("-0")).toEqualBigInt(1);
        });

        it("to negative numbers is 0", function () {
            expect(bigInt(0).pow(-298)).toEqualBigInt(0);
            expect(bigInt(543).pow(-2)).toEqualBigInt(0);
            expect(bigInt("323434643534523").pow(-1)).toEqualBigInt(0);
            expect(bigInt(-54302).pow("-543624724341214223562")).toEqualBigInt(0);
            expect(bigInt("-20199605604968").pow(-99)).toEqualBigInt(0);

            expect(bigInt(1).pow(-1)).toEqualBigInt(1);
            expect(bigInt(-1).pow(-1)).toEqualBigInt(-1);
            expect(bigInt(-1).pow(-2)).toEqualBigInt(1);
        });

        it("handles signs correctly", function () {
            expect(bigInt(2).pow(3)).toEqualBigInt(8);
            expect(bigInt(-2).pow(3)).toEqualBigInt(-8);
            expect(bigInt("1036350201654").pow(4)).toEqualBigInt("1153522698998527286707879497611725813209153232656");
            expect(bigInt("-1036350201654").pow(4)).toEqualBigInt("1153522698998527286707879497611725813209153232656");
            expect(bigInt("-154654987").pow(3)).toEqualBigInt("-3699063497752861435082803");

            expect(bigInt(1).pow(1)).toEqualBigInt(1);
            expect(bigInt(-1).pow(1)).toEqualBigInt(-1);
            expect(bigInt(-1).pow(2)).toEqualBigInt(1);
        });

        it("carries over correctly", function () {
            expect(bigInt("16").pow("13")).toEqualBigInt("4503599627370496");
            expect(bigInt("123456789123456789").pow("10")).toEqualBigInt("822526267372365207989468699031914332476569003445489153619518989325083908083922133639704420166045905346960117046949453426283086050487204639652635846010822673782217799736601");
            expect(bigInt("2").pow("63")).toEqualBigInt("9223372036854775808");
            // See issue #5
            //   https://github.com/peterolson/BigInteger.js/issues/5
            expect(bigInt(100).pow(56).toString()).not.toEqualBigInt("0");

        });

        it("throws an error when the exponent is too large", function () {
            try {
                bigInt(2).pow("1e100");
                expect(true).toBe(false);
            }
            catch (e) {
                expect(true).toBe(true);
            }
            expect(bigInt(1).pow("1e100")).toEqualBigInt(1);
            expect(bigInt(-1).pow("1e100")).toEqualBigInt(1);
            expect(bigInt(0).pow("1e100")).toEqualBigInt(0);
        });

        it("throws an error when the exponent is not an integer", function () {
            expect(function () {
                bigInt(5).pow(1 / 2);
            }).toThrow();
        });
    });

    describe("Power modulo", function () {
        it("works", function () {
            expect(bigInt(4).modPow(13, 497)).toEqualBigInt(445);

            // See Project Euler problem #97
            //   https://projecteuler.net/problem=97
            expect(bigInt(28433).times(bigInt(2).modPow(7830457, "1e10")).plus(1).mod("1e10")).toEqualBigInt(8739992577);
            expect(bigInt(0).modPow(4, 20)).toEqualBigInt(0);
            expect(bigInt(0).modPow(0, 20)).toEqualBigInt(1);
            try {
                bigInt(4).modPow(9, 0);
                expect(true).toBe(false);
            }
            catch (e) {
                expect(true).toBe(true);
            }

            expect(bigInt(2).modPow(-3, 11)).toEqualBigInt(7);
            expect(bigInt(76455).modPow(-3758223534, 346346)).toEqualBigInt(339949);
        });
    });

    describe("Modular multiplicative inverse", function () {
        it("works", function () {
            expect(bigInt(3).modInv(11)).toEqualBigInt(4);
            expect(bigInt(42).modInv(2017)).toEqualBigInt(1969);
            expect(bigInt(-50).modInv(83)).toEqualBigInt(-5); // issue #87
            expect(function () {
                bigInt(154).modInv(3311);
            }).toThrow();
        });
    });

    describe("Square", function () {
        it("works", function () {
            expect(bigInt(0).square()).toEqualBigInt(0);
            expect(bigInt(16).square()).toEqualBigInt(256);
            expect(bigInt(-16).square()).toEqualBigInt(256);
            expect(bigInt("65536").square()).toEqualBigInt("4294967296");
        });
    });

    describe("prev and next", function () {
        it("work", function () {
            expect(bigInt(0).next()).toEqualBigInt(1);
            expect(bigInt(-1).next()).toEqualBigInt(0);
            expect(bigInt(34).next()).toEqualBigInt(35);
            expect(bigInt("9007199254740992").next()).toEqualBigInt("9007199254740993");
            expect(bigInt("-9007199254740992").next()).toEqualBigInt("-9007199254740991");
            expect(bigInt("9007199254740992999").next()).toEqualBigInt("9007199254740993000");
            expect(bigInt("9007199254740991").next()).toEqualBigInt("9007199254740992");

            expect(bigInt(0).prev()).toEqualBigInt(-1);
            expect(bigInt(-1).prev()).toEqualBigInt(-2);
            expect(bigInt(34).prev()).toEqualBigInt(33);
            expect(bigInt("9007199254740992").prev()).toEqualBigInt("9007199254740991");
            expect(bigInt("-9007199254740992").prev()).toEqualBigInt("-9007199254740993");
            expect(bigInt("9007199254740992999").prev()).toEqualBigInt("9007199254740992998");
            expect(bigInt("-9007199254740991").prev()).toEqualBigInt("-9007199254740992");
        });
    });

    describe("min and max", function () {
        it("work", function () {
            expect(bigInt.max(6, 6)).toEqualBigInt(6);
            expect(bigInt.max(77, 432)).toEqualBigInt(432);
            expect(bigInt.max(432, 77)).toEqualBigInt(432);
            expect(bigInt.max(77, -432)).toEqualBigInt(77);
            expect(bigInt.max(432, -77)).toEqualBigInt(432);
            expect(bigInt.max(-77, 432)).toEqualBigInt(432);
            expect(bigInt.max(-432, 77)).toEqualBigInt(77);
            expect(bigInt.max(-77, -432)).toEqualBigInt(-77);
            expect(bigInt.max(-432, -77)).toEqualBigInt(-77);

            expect(bigInt.min(6, 6)).toEqualBigInt(6);
            expect(bigInt.min(77, 432)).toEqualBigInt(77);
            expect(bigInt.min(432, 77)).toEqualBigInt(77);
            expect(bigInt.min(77, -432)).toEqualBigInt(-432);
            expect(bigInt.min(432, -77)).toEqualBigInt(-77);
            expect(bigInt.min(-77, 432)).toEqualBigInt(-77);
            expect(bigInt.min(-432, 77)).toEqualBigInt(-432);
            expect(bigInt.min(-77, -432)).toEqualBigInt(-432);
            expect(bigInt.min(-432, -77)).toEqualBigInt(-432);
        });
    });

    describe("lcm and gcd", function () {
        it("work", function () {
            expect(bigInt.lcm(21, 6)).toEqualBigInt(42);
            expect(bigInt.gcd(42, 56)).toEqualBigInt(14);
            expect(bigInt.gcd(0, 56)).toEqualBigInt(56);
            expect(bigInt.gcd(42, 0)).toEqualBigInt(42);
            expect(bigInt.gcd(17, 103)).toEqualBigInt(1);
            expect(bigInt.gcd(192, 84)).toEqualBigInt(12);
        });
    });

    describe("Increment and decrement", function () {
        it("works for small values", function () {
            expect(bigInt(546).prev()).toEqualBigInt(545);
            expect(bigInt(1).prev()).toEqualBigInt(0);
            expect(bigInt(0).prev()).toEqualBigInt(-1);
            expect(bigInt(-1).prev()).toEqualBigInt(-2);
            expect(bigInt(-1987).prev()).toEqualBigInt(-1988);

            expect(bigInt(546).next()).toEqualBigInt(547);
            expect(bigInt(1).next()).toEqualBigInt(2);
            expect(bigInt(0).next()).toEqualBigInt(1);
            expect(bigInt(-1).next()).toEqualBigInt(0);
            expect(bigInt(-1987).next()).toEqualBigInt(-1986);
        });
        it("works for large values", function () {
            expect(bigInt("109874981950949849811049").prev()).toEqualBigInt("109874981950949849811048");
            expect(bigInt("109874981950949849811049").next()).toEqualBigInt("109874981950949849811050");
            expect(bigInt("-109874981950949849811049").prev()).toEqualBigInt("-109874981950949849811050");
            expect(bigInt("-109874981950949849811049").next()).toEqualBigInt("-109874981950949849811048");
        });
        it("carries over correctly", function () {
            expect(bigInt(9999999).next()).toEqualBigInt(10000000);
            expect(bigInt(10000000).prev()).toEqualBigInt(9999999);
        });
    });

    describe("Absolute value", function () {
        it("works", function () {
            expect(bigInt(0).abs()).toEqualBigInt(0);
            expect(bigInt("-0").abs()).toEqualBigInt(0);
            expect(bigInt(54).abs()).toEqualBigInt(54);
            expect(bigInt(-54).abs()).toEqualBigInt(54);
            expect(bigInt("13412564654613034984065434").abs()).toEqualBigInt("13412564654613034984065434");
            expect(bigInt("-13412564654613034984065434").abs()).toEqualBigInt("13412564654613034984065434");
        });
    });

    describe("isPositive and isNegative", function () {
        it("return `false` for 0 and -0", function () {
            expect(bigInt(0).isPositive()).toBe(false);
            expect(bigInt(0).isNegative()).toBe(false);
            expect(bigInt(-0).isPositive()).toBe(false);
            expect(bigInt(-0).isNegative()).toBe(false);
        });

        it("work for small numbers", function () {
            expect(bigInt(1).isPositive()).toBe(true);
            expect(bigInt(543).isNegative()).toBe(false);
            expect(bigInt(-1).isPositive()).toBe(false);
            expect(bigInt(-765).isNegative()).toBe(true);
        });

        it("work for big numbers", function () {
            expect(bigInt("651987498619879841").isPositive()).toBe(true);
            expect(bigInt("0054984980098460").isNegative()).toBe(false);
            expect(bigInt("-1961987984109078496").isPositive()).toBe(false);
            expect(bigInt("-98800984196109540984").isNegative()).toBe(true);
        });
    });

    describe("isEven and isOdd", function () {
        it("work correctly", function () {
            expect(bigInt(0).isEven()).toBe(true);
            expect(bigInt(0).isOdd()).toBe(false);

            expect(bigInt(654).isEven()).toBe(true);
            expect(bigInt(654).isOdd()).toBe(false);

            expect(bigInt(653).isOdd()).toBe(true);
            expect(bigInt(653).isEven()).toBe(false);

            expect(bigInt(-984).isEven()).toBe(true);
            expect(bigInt(-984).isOdd()).toBe(false);

            expect(bigInt(-987).isOdd()).toBe(true);
            expect(bigInt(-987).isEven()).toBe(false);

            expect(bigInt("9888651888888888").isEven()).toBe(true);
            expect(bigInt("9888651888888888").isOdd()).toBe(false);

            expect(bigInt("1026377777777777").isOdd()).toBe(true);
            expect(bigInt("1026377777777777").isEven()).toBe(false);

            expect(bigInt("-9888651888888888").isEven()).toBe(true);
            expect(bigInt("-9888651888888888").isOdd()).toBe(false);

            expect(bigInt("-1026377777777777").isOdd()).toBe(true);
            expect(bigInt("-1026377777777777").isEven()).toBe(false);
        });
    });

    describe("isDivisibleBy", function () {
        it("works", function () {
            expect(bigInt(999).isDivisibleBy(333)).toBe(true);
            expect(bigInt(999).isDivisibleBy(331)).toBe(false);
            expect(bigInt(999).isDivisibleBy(0)).toBe(false);
            expect(bigInt(999).isDivisibleBy(1)).toBe(true);
            expect(bigInt(999).isDivisibleBy(2)).toBe(false);
        });
    });

    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001, 3011, 3019, 3023, 3037, 3041, 3049, 3061, 3067, 3079, 3083, 3089, 3109, 3119, 3121, 3137, 3163, 3167, 3169, 3181, 3187, 3191, 3203, 3209, 3217, 3221, 3229, 3251, 3253, 3257, 3259, 3271, 3299, 3301, 3307, 3313, 3319, 3323, 3329, 3331, 3343, 3347, 3359, 3361, 3371, 3373, 3389, 3391, 3407, 3413, 3433, 3449, 3457, 3461, 3463, 3467, 3469, 3491, 3499, 3511, 3517, 3527, 3529, 3533, 3539, 3541, 3547, 3557, 3559, 3571];

    describe("isPrime", function () {
        it("correctly identifies prime numbers", function () {
            for (let i = 0; i < primes.length; i++) {
                expect(bigInt(primes[i]).isPrime()).toBe(true);
            }
        });
        it("correctly identifies pseudo primes", function () {
            const largePrimes = ["4033", "4681", "3825123056546413051", "3825123056546413051", "3825123056546413051", "318665857834031151167461"];
            for (let i = 0; i < largePrimes.length; i++) {
                expect(bigInt(largePrimes[i]).isPrime()).toBe(false);
            }
        });
        it("correctly rejects nonprime numbers", function () {
            const nonPrimes = [1, 4, 3 * 5, 4 * 7, 7 * 17, 3 * 103, 17 * 97, 7917];
            for (let i = 0; i < nonPrimes.length; i++) {
                expect(bigInt(nonPrimes[i]).isPrime()).toBe(false);
            }
        });
    });

    describe("isProbablePrime", function () {
        it("returns true for any prime", function () {
            for (let i = 0; i < primes.length; i++) {
                expect(bigInt(primes[i]).isProbablePrime()).toBe(true);
            }
        });
        it("returns false for any Carmichael number", function () {
            const carmichaelNumbers = [561, 1105, 1729, 2465, 2821, 6601, 8911, 10585, 15841, 29341, 41041, 46657, 52633, 62745, 63973, 75361, 101101, 115921, 126217, 162401, 172081, 188461, 252601, 278545, 294409, 314821, 334153, 340561, 399001, 410041, 449065, 488881, 512461];
            for (let i = 0; i < carmichaelNumbers.length; i++) {
                expect(bigInt(carmichaelNumbers[i]).isProbablePrime()).toBe(false);
            }
        });
        it("has false positive rate less than 0.1%", function () {
            let totalPrimes = 0;
            let falsePrimes = 0;
            for (let i = 1; i < 1e4; i++) {
                const x: BigInteger = bigInt(i);
                if (x.isPrime()) {
                    totalPrimes++;
                }
                else if (x.isProbablePrime()) {
                    falsePrimes++;
                }
            }
            expect(falsePrimes / totalPrimes < 0.001).toBe(true);
        });
        it("is predictable given predictable rng", function () {
            function getProbablePrimes(fakeRNG: () => number): number[] {
                const result: number[] = [];
                for (let i = 1; i < 100; i++) {
                    const x = bigInt(i);
                    if (x.isProbablePrime(1, fakeRNG)) {
                        result.push(i);
                    }
                }
                return result;
            }
            for (let i = 0; i < 100; i++) {
                const fakeRNG = () => {
                    return (i * 0.3571) % 1;
                };
                expect(getProbablePrimes(fakeRNG)).toEqual(getProbablePrimes(fakeRNG));
            }
        });
    });

    describe("isUnit", function () {
        it("works", function () {
            expect(bigInt.one.isUnit()).toBe(true);
            expect(bigInt.minusOne.isUnit()).toBe(true);
            expect(bigInt.zero.isUnit()).toBe(false);
            expect(bigInt(5).isUnit()).toBe(false);
            expect(bigInt(-5).isUnit()).toBe(false);
            expect(bigInt("654609649089416160").isUnit()).toBe(false);
            expect(bigInt("-98410980984981094").isUnit()).toBe(false);
        });
    });

    describe("isZero", function () {
        it("works", function () {
            expect(bigInt.zero.isZero()).toBe(true);
            expect(bigInt(0).isZero()).toBe(true);
            expect(bigInt("-0").isZero()).toBe(true);
            expect(bigInt(15).isZero()).toBe(false);
            expect(bigInt(-15).isZero()).toBe(false);
            expect(bigInt("63213098189462109840").isZero()).toBe(false);
            expect(bigInt("-64343745644564564563").isZero()).toBe(false);
            expect(bigInt().isZero()).toBe(true);
            expect(bigInt(0, 10).isZero()).toBe(true);
        });
    });

    describe("Throw error in input with", function () {
        function test(input) {
            expect(function () {
                bigInt(input);
            }).toThrow();
        }
        it("multiple minus signs at the beginning", function () {
            test("--123");
            test("---1423423");
        });

        it("non-numeric symbols", function () {
            test("43a34");
            test("4+7=11");
        });

        it("multiple exponents", function () {
            test("43e4e6");
            test("234234e43523e4354");
            try {
                bigInt("4e5e5");
            }
            catch (e) {
                expect(e instanceof TypeError).toBe(false);
            }
        });

        it("decimal point when exponent is too small", function () {
            test("1.24595e3");
        });

        describe("but not with", function () {
            it("e or E for the exponent", function () {
                expect(bigInt("2e7").equals("2E7")).toBe(true);
            });

            it("e+ or E+ for the exponent", function () {
                expect(bigInt("2e7").equals("2E+7")).toBe(true);
                expect(bigInt("1.7976931348623157e+308").equals("179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000")).toBe(true);
            });

            it("decimal point when exponent is large enough", function () {
                expect(bigInt("1.32e2").equals("132")).toBe(true);
            });
        });
    });

    describe("toString", function () {
        it("works for leading and trailing zeroes", function () {
            expect(bigInt("10000000").toString() === "10000000").toBe(true);
            expect(bigInt("100001010000000").toString() === "100001010000000").toBe(true);
            expect(bigInt("00000000010000000").toString() === "10000000").toBe(true);
            expect(bigInt("00000000100001010000000").toString() === "100001010000000").toBe(true);
        });

        // See issue #13
        //   https://github.com/peterolson/BigInteger.js/issues/13
        it("of 0*-1 is '0'", function () {
            expect(bigInt(0).multiply(-1).toString() === "0").toBe(true);
        });

        // See pull request #16
        //  https://github.com/peterolson/BigInteger.js/pull/16
        it("of (0/1)-100 is '-100'", function () {
            expect((bigInt("0")).divide(bigInt("1")).add(bigInt("-100")).toString() === "-100").toBe(true);
        });
    });

    describe("valueOf and toJSNumber", function () {
        it("works", function () {
            expect(bigInt(100) + bigInt(200) == 300).toBe(true);
            expect(bigInt("100000000000300").valueOf() - bigInt("100000000000000").valueOf() == 300).toBe(true);
            expect(bigInt(100).valueOf() == 100).toBe(true);
            expect(bigInt(43.9e30) == 43.9e30).toBe(true);
            expect(bigInt("1.11e+30").toJSNumber() == 1.11e+30).toBe(true);
            expect(bigInt(100).toJSNumber() === 100).toBe(true);
            expect(bigInt("1e30").toJSNumber() === 1e30).toBe(true);
            expect(bigInt("100000000000000008193").toJSNumber()).toBe(100000000000000016384);
        });
    });

    describe("Base conversion", function () {
        it("parses numbers correctly", function () {
            expect(bigInt("10", 2).equals(2)).toBe(true);
            expect(bigInt("FF", 16)).toEqualBigInt(255);
            expect(bigInt("111100001111", -2)).toEqualBigInt(-1285);
            expect(bigInt("<5><10>35<75><44><88><145735>", "-154654987")).toEqualBigInt("-10580775516023906041313915824083789618333601575504631498551");

            // See pull request 16
            //   https://github.com/peterolson/BigInteger.js/pull/15
            expect(bigInt("-1", 16)).toEqualBigInt(-1);
            expect(bigInt("306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000306057512216440636035370461297268629388588804173576999416776741259476533176716867465515291422477573349939147888701726368864263907759003154226842927906974559841225476930271954604008012215776252176854255965356903506788725264321896264299365204576448830388909753943489625436053225980776521270822437639449120128678675368305712293681943649956460498166450227716500185176546469340112226034729724066333258583506870150169794168850353752137554910289126407157154830282284937952636580145235233156936482233436799254594095276820608062232812387383880817049600000000000000000000000000000000000000000000000000000000000000000000000000")).toEqualBigInt(bigInt("9822997e35bb99bcf103a64299aa92b8446ab93879fba53349f1626f3c8f78a4ee1d8d9e7562538f8e374fdf64c8eff7481c63cde5ca9821abfb3df6fb3e2489d2f85d34cf347f3e89191a19cc6b6b8072a976a8f1bcf68d20f18a1c0efb023252ba2d0961428a5c282d2645f3f7fa160f7f84aca88e40a74066c4a787bed7d0082f7e45b1ffee532715f56bd5f8168eaf7eaae112ed1316371f047692631e70e6b85b290ef063845b364dad7e10b9deb9fcfb708f83b7c3c6b82ce16eb0034c030b332a58d637a7b547fd0527051d7de9e5004db2ea2bd75f5c5a280a1a9b93c3c83373b6dcf1b65c01197096e97d13076b6613bc2ebf47c91fbe1aefeea966134bfbbf5f850320f0f0c2d88888bd82d118a6aaf8df2b092cf5456eff7e209feb476bf3c01d6d2e7ca0b9f40d83b107b4def92f2927cf0a1bb6190c67a4da91478709262ed1f1ecb77fbaf1197ac238c246a63a697f51e8d539f850e790137e7fce5f764896fdfb4fc3787520608f0400e72aeea5737c36304c6887ec1a174564ecec63a57b1e0946dc311dd3aea7bfae197ff9c7fcbf17c97d9db303d231702ef502dde1b53896196dc2e5d30b2b6ec58fc3744f4de08109eb99aa9f22ffe2f12f3953f516f91d35a8852aff4a19e250410fbd8dbcdae99f92f88e2f94341fc1ecdff32733d194c0541f708a72c5b4c03e5515e1086d0903addca0e172968ff1dee87bbd4fee679e2ee5a52975807ae7212cc2a33e0821e2d9b44eaa7dc29536a94c6597eda41bdd1e5e618e7b388b53d38ef9542523bce888738db46c6706c3ee82cbc3655408071e9e422a44d309e3cfd31ec2135ee0cba32b0c6721c8bee4d076543b71c35a06087a007c14e51d1f0c4d0aa9aa0751dfd3776d2357a010e6b147aca40c7b669291e6defbf5ca77505c960f14b330e6c90dc2539431329ef78a1e9f26b2ead7d28a622e6b586bcee22bd0a495442c6a1235588988252cbd4d36975560fb8e7e5c8cf06f29aeb68659c5cb4cf8d011375b00000000000000000000000000000000000000000000000000000000000000000000000000", 16));
            expect(bigInt("9223372036854775808")).toEqualBigInt(bigInt("1000000000000000000000000000000000000000000000000000000000000000", 2));
            expect(bigInt("324AFCCC342342333CCD239998881232324AFCCC342342333CCD239998881232", 16)).toEqualBigInt("22748133857356174891035811692236022265357659892433333914058690475216129757746");
            expect(bigInt("234345345345")).toEqualBigInt(bigInt("3690123141", 16));
            expect(bigInt("-10", 16)).toEqualBigInt("-16");
        });

        it("errors on invalid input", function () {
            expect(function () {
                bigInt("$,%@#^", "55");
            }).toThrow();
            // See issue 101
            //    https://github.com/peterolson/BigInteger.js/issues/101
            expect(function () {
                bigInt("0x10000", 16);
            }).toThrow();
            expect(function () {
                bigInt("a9", 10);
            }).toThrow();
            expect(function () {
                bigInt("33", 2);
            }).toThrow();
        });

        it("outputs numbers correctly", function () {
            expect(bigInt("366900685503779409298642816707647664013657589336").toString(16) === "4044654fce69424a651af2825b37124c25094658").toBe(true);
            expect(bigInt("111111111111111111111111111111111111111111111111111111", 2).toString(2) === "111111111111111111111111111111111111111111111111111111").toBe(true);
            expect(bigInt("secretmessage000", -36).toString(-36) === "secretmessage000").toBe(true);
            expect(bigInt(-256).toString(16) === "-100").toBe(true);
            expect(bigInt(256).toString(1).length === 256).toBe(true);
            expect(bigInt(bigInt(77).toString(-1), -1)).toEqualBigInt(77);
            expect(function () {
                bigInt(10).toString(0);
            }).toThrow();

            // see issue #67
            // https://github.com/peterolson/BigInteger.js/issues/67
            expect(bigInt(36).toString(40) === "<36>").toBe(true);
        });

        it("converts to arrays correctly", function () {
            expect(bigInt("1e9").toArray(10)).toEqual({
                value: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                isNegative: false
            });

            expect(bigInt("1e20").toArray(10)).toEqual({
                value: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                isNegative: false
            });

            expect(bigInt("1e9").toArray(16)).toEqual({
                value: [3, 11, 9, 10, 12, 10, 0, 0],
                isNegative: false
            });

            expect(bigInt(567890).toArray(100)).toEqual({
                value: [56, 78, 90],
                isNegative: false
            });

            expect(bigInt(12345).toArray(-10)).toEqual({
                value: [2, 8, 4, 6, 5],
                isNegative: false
            });

            expect(bigInt(-15).toArray(1)).toEqual({
                value: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                isNegative: true
            });

            expect(bigInt(0).toArray(1)).toEqual({
                value: [0],
                isNegative: false
            });

            expect(bigInt(-15).toArray(-1)).toEqual({
                value: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
                isNegative: false
            });

            expect(bigInt(0).toArray(-1)).toEqual({
                value: [0],
                isNegative: false
            });

            expect(bigInt(0).toArray(0)).toEqual({
                value: [0],
                isNegative: false
            });

            expect(function () {
                return bigInt(1).toArray(0);
            }).toThrow();
        });

        it("allows custom alphabet", function () {
            expect(bigInt("9786534201", 10, "9786534201")).toEqualBigInt("0123456789");
            expect(bigInt("bC", 3, "abc")).toEqualBigInt("5");
            expect(bigInt("AAa", 2, "aA", true)).toEqualBigInt("6");
            expect(bigInt("10").toString(2, "Aa")).toEqual("aAaA");
        });
    });

    describe("Bitwise operations", function () {
        it("shifting left and right work", function () {
            expect(bigInt(-5).shiftRight(2)).toEqualBigInt(-2);
            expect(bigInt(5).shiftRight(-2)).toEqualBigInt(20);
            expect(bigInt(5).shiftLeft(-2)).toEqualBigInt(1);
            expect(bigInt(1024).shiftLeft(100)).toEqualBigInt("1298074214633706907132624082305024");
            expect(bigInt("2596148429267413814265248164610049").shiftRight(100)).toEqualBigInt(2048);
            expect(bigInt("8589934592").shiftRight(-50)).toEqualBigInt("9671406556917033397649408");
            expect(bigInt("38685626227668133590597632").shiftLeft(-50)).toEqualBigInt("34359738368");
            expect(bigInt("-1").shiftRight(25)).toEqualBigInt(-1);
            expect(bigInt(1).shiftLeft(bigInt(1))).toEqualBigInt(2); // https://github.com/peterolson/BigInteger.js/issues/163
        });

        it("shifting left and right throw for large shifts", function () {
            expect(function () {
                bigInt(5).shiftLeft("5e10");
            }).toThrow();
            expect(function () {
                bigInt(5).shiftRight("5e10");
            }).toThrow();
        });

        it("and, or, xor, and not work", function () {
            expect(bigInt("435783453").and("902345074")).toEqualBigInt("298352912");
            expect(bigInt("435783453").or("902345074")).toEqualBigInt("1039775615");
            expect(bigInt("435783453").xor("902345074")).toEqualBigInt("741422703");
            expect(bigInt("94981987261387596").not()).toEqualBigInt("-94981987261387597");
            expect(bigInt("-6931047708307681506").xor("25214903917")).toEqualBigInt("-6931047723896018573");
            expect(bigInt("-6931047723896018573").and("281474976710655")).toEqualBigInt("273577603885427");
            expect(bigInt("-65").xor("-42")).toEqualBigInt("105");
            expect(bigInt("6").and("-3")).toEqualBigInt("4");
            expect(bigInt("0").not()).toEqualBigInt("-1");
            expect(bigInt("13").or(-8)).toEqualBigInt("-3");
            expect(bigInt("12").xor(-5)).toEqualBigInt("-9");
        });

        it("bitLength works", function () {
            expect(bigInt(0).bitLength()).toEqualBigInt(0);
            expect(bigInt(1).bitLength()).toEqualBigInt(1);
            expect(bigInt(3).bitLength()).toEqualBigInt(2);
            expect(bigInt(16).bitLength()).toEqualBigInt(5);
            expect(bigInt(2).pow(49).bitLength()).toEqualBigInt(50);
        });
    });

    describe("randBetween", function () {
        it("return numbers in correct range", function () {
            expect(bigInt.randBetween(0, 10).leq(10)).toBe(true);
            expect(bigInt.randBetween(0, 10).geq(0)).toBe(true);

            expect(bigInt.randBetween(0, "9e99").leq("9e99")).toBe(true);
            expect(bigInt.randBetween(0, "9e99").geq(0)).toBe(true);

            expect(bigInt.randBetween("-9e99", 10).leq(10)).toBe(true);
            expect(bigInt.randBetween("-9e99", 10).geq("-9e99")).toBe(true);

            expect(bigInt.randBetween("-9e99", "9e99").leq("9e99")).toBe(true);
            expect(bigInt.randBetween("-9e99", "9e99").geq("-9e99")).toBe(true);
        });
        it("always returns integers", function () {
            expect(bigInt.randBetween(0, 127) % 1).toBe(0);

            for (let i = 0; i < 20; i++) { // issue #60
                expect(bigInt.randBetween(0, "11703780079612452").toString()).not.toBe("undefined");
            }
        });
        it("is within 10% of uniform distribution (this test is probabilistic and has a small change of failing)", function () {
            const ranges = [["0", "1e25"], ["0", "16777215"]];
            for (let j = 0; j < ranges.length; j++) {
                const range = ranges[j];
                const buckets = new Array(25), N = 50000;
                for (let i = 0; i < buckets.length; i++) buckets[i] = 0;
                const min = bigInt(range[0]), max = bigInt(range[1]);
                for (let i = 0; i < N; i++) {
                    const value = bigInt.randBetween(min, max);
                    const index = value.minus(min).times(buckets.length).over(max.minus(min).add(1));
                    if (index >= buckets.length) {
                        throw new RangeError(value);
                    }
                    buckets[index]++;
                }
                // console.debug('buckets:', buckets);
                const ideal = N / buckets.length;
                for (let i = 0; i < buckets.length; i++) {
                    expect(Math.abs(buckets[i] - ideal) / ideal).toBeLessThan(0.1);
                }
            }
        });
        it("is predictable given predictable rng", function () {
            for (let i = 0; i < 1e3; i++) {
                const fakeRNG = () => {
                    return (i * 0.3571) % 1;
                };
                expect(bigInt.randBetween(0, 1024, fakeRNG)).toEqualBigInt(bigInt.randBetween(0, 1024, fakeRNG));
            }
        });
    });

    describe("isInstance", function () {
        it("works", function () {
            expect(bigInt.isInstance(bigInt(14))).toBe(true);
            expect(bigInt.isInstance(14)).toBe(false);
            expect(bigInt.isInstance(bigInt("2343345345345236243564564363546"))).toBe(true);
            expect(bigInt.isInstance("3456356345634564356435643634564334")).toBe(false);
        });
    });

    describe("fromArray", function () {
        it("works", function () {
            expect(bigInt.fromArray([1, 2, 3, 4, 5])).toEqualBigInt("12345");
            expect(bigInt.fromArray([1, 2, 3, 4, 5], 10)).toEqualBigInt("12345");
            expect(bigInt.fromArray([1, 2, 3, 4, 5], 10, true)).toEqualBigInt("-12345");
            expect(bigInt.fromArray([1, 2, 3, 4, 5], 256)).toEqualBigInt("4328719365");
        });
    });

    describe("Aliases", function () {
        xit("add, plus are the same", function () {
            expect(bigInt.one.add === bigInt.one.plus).toBe(true);
        });
        xit("compare, compareTo are the same", function () {
            expect(bigInt.one.compare === bigInt.one.compareTo).toBe(true);
        });
        xit("divide, over are the same", function () {
            expect(bigInt.one.divide === bigInt.one.over).toBe(true);
        });
        xit("equals, eq are the same", function () {
            expect(bigInt.one.equals === bigInt.one.eq).toBe(true);
        });
        xit("greater, gt are the same", function () {
            expect(bigInt.one.greater === bigInt.one.gt).toBe(true);
        });
        xit("greaterOrEquals, geq are the same", function () {
            expect(bigInt.one.greaterOrEquals === bigInt.one.geq).toBe(true);
        });
        xit("lesser, lt are the same", function () {
            expect(bigInt.one.lesser === bigInt.one.lt).toBe(true);
        });
        xit("lesserOrEquals, leq are the same", function () {
            expect(bigInt.one.lesserOrEquals === bigInt.one.leq).toBe(true);
        });
        xit("notEquals, neq are the same", function () {
            expect(bigInt.one.notEquals === bigInt.one.neq).toBe(true);
        });
        xit("subtract, minus are the same", function () {
            expect(bigInt.one.subtract === bigInt.one.minus).toBe(true);
        });
        xit("mod, remainder are the same", function () {
            expect(bigInt.one.mod === bigInt.one.remainder).toBe(true);
        });
        xit("multiply, times are the same", function () {
            expect(bigInt.one.multiply === bigInt.one.times).toBe(true);
        });
    });

    describe("Integer", function () {
        xit("prototype chain", function () {
            expect(bigInt(14) instanceof bigInt).toBe(true);
            expect(bigInt(10e20) instanceof bigInt).toBe(true);
        });

        it("object construction", function () {
            expect((bigInt(14)).add(bigInt(7)).eq(21)).toBe(true);
        });

        it("JSON stringifiction", function () {
            const x = JSON.parse(JSON.stringify({
                a: bigInt(4),
                b: bigInt("4e100")
            }));
            expect(x.a).toEqualBigInt("4");
            expect(x.b).toEqualBigInt("4e100");
        });
    });
});