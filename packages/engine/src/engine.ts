import {
    ALL_FEATURES,
    AtomExtensionBuilderFromExprHandlerBuilder,
    create_algebra_as_blades,
    create_env,
    create_uom,
    directive_from_flag,
    env_term,
    ExtensionEnv,
    init_env,
    render_as_ascii,
    render_as_human,
    render_as_infix,
    render_as_latex,
    render_as_sexpr,
    RESERVED_KEYWORD_LAST,
    RESERVED_KEYWORD_TTY,
    simplify,
    transform_tree,
    UOM_NAMES
} from "@stemcmicro/algebrite";
import { assert_sym, Cell, create_int, create_rat, create_sym, Sym } from "@stemcmicro/atoms";
import { ExprContext, ExprHandler, LambdaExpr } from "@stemcmicro/context";
import { Directive } from "@stemcmicro/directive";
import { render_svg } from "@stemcmicro/eigenmath";
import { EmParseOptions, em_parse } from "@stemcmicro/em-parse";
import { Native, native_sym } from "@stemcmicro/native";
import { ProgramStack } from "@stemcmicro/stack";
import { assert_U, Atom, Cons, items_to_cons, nil, U } from "@stemcmicro/tree";

export interface ParseConfig {
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
    explicitAssocAdd: boolean;
    explicitAssocExt: boolean;
    explicitAssocMul: boolean;
}

export interface RenderConfig {
    format: "Ascii" | "Human" | "Infix" | "LaTeX" | "SExpr" | "SVG";
    useCaretForExponentiation: boolean;
    useParenForTensors: boolean;
}

export enum Concept {
    Last = 1,
    TTY = 2
}

export interface CellListener {
    reset(from: U, to: U, source: Cell): void;
}

export interface ExprEngineListener {
    output(output: string): void;
}

export interface ExprHandlerBuilder<T extends U> {
    create(): ExprHandler<T>;
}

export interface ExprEngine extends Pick<ExprContext, "clearBindings">, Pick<ExprContext, "pushDirective" | "popDirective"> {
    clearBindings(): void;

    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void;
    defineFunction(name: Sym, lambda: LambdaExpr): void;

    parse(sourceText: string): { trees: U[]; errors: Error[] };

    simplify(expr: U): U;
    valueOf(expr: U): U;

    getBinding(opr: Sym, target: Cons): U;
    hasBinding(opr: Sym, target: Cons): boolean;
    setBinding(opr: Sym, binding: U): void;

    hasUserFunction(name: Sym): boolean;
    getUserFunction(name: Sym): U;
    setUserFunction(name: Sym, userfunc: U): void;

    symbol(concept: Concept): Sym;

    renderAsString(expr: U, config?: Partial<RenderConfig>): string;

    addCellListener(listener: CellListener): void;
    removeCellListener(listener: CellListener): void;

    addListener(listener: ExprEngineListener): void;
    removeListener(listener: ExprEngineListener): void;

    release(): void;
}

export interface EngineConfig {
    allowUndeclaredVars: "Err" | "Nil";
    prolog: string[];
    useCaretForExponentiation: boolean;
    useDerivativeShorthandLowerD: boolean;
    useIntegersForPredicates: boolean;
}

function allow_undeclared_vars(options: Partial<EngineConfig>, allowDefault: "Err" | "Nil"): "Err" | "Nil" {
    if (typeof options.allowUndeclaredVars === "string") {
        return options.allowUndeclaredVars;
    } else {
        return allowDefault;
    }
}

export function define_math_constant_pi($: ExtensionEnv): void {
    $.setBinding(create_sym("pi"), native_sym(Native.PI));
}

export function define_spacetime_algebra($: ExtensionEnv): void {
    const blades = create_algebra_as_blades([create_int(-1), create_int(1), create_int(1), create_int(1)], ["e0", "e1", "e2", "e3"], $);
    $.setBinding(create_sym("e0"), blades[0]);
    $.setBinding(create_sym("e1"), blades[1]);
    $.setBinding(create_sym("e2"), blades[2]);
    $.setBinding(create_sym("e3"), blades[3]);
}

export function define_geometric30_algebra($: ExtensionEnv): void {
    const blades = create_algebra_as_blades([create_int(1), create_int(1), create_int(1)], ["ex", "ey", "ez"], $);
    $.setBinding(create_sym("ex"), blades[0]);
    $.setBinding(create_sym("ey"), blades[1]);
    $.setBinding(create_sym("ez"), blades[2]);
}

export function define_si_units($: ExtensionEnv): void {
    for (let i = 0; i < UOM_NAMES.length; i++) {
        $.setBinding(create_sym(UOM_NAMES[i]), create_uom(UOM_NAMES[i]));
    }
}

/**
 * https://en.wikipedia.org/wiki/Metric_prefix
 */
export function define_metric_prefixes_for_si_units($: ExtensionEnv): void {
    // d
    const deci = create_rat(1, 10);
    $.setBinding(create_sym("deci"), deci);

    // c
    const centi = create_rat(1, 100);
    $.setBinding(create_sym("centi"), centi);

    // m
    const milli = create_rat(1, 1000);
    $.setBinding(create_sym("milli"), milli);

    // mu
    const micro = milli.mul(milli);
    $.setBinding(create_sym("micro"), micro);

    // n
    const nano = micro.mul(milli);
    $.setBinding(create_sym("nano"), nano);

    // p
    const pico = nano.mul(milli);
    $.setBinding(create_sym("pico"), pico);

    // f
    const femto = pico.mul(milli);
    $.setBinding(create_sym("femto"), femto);

    // a
    const atto = femto.mul(milli);
    $.setBinding(create_sym("atto"), atto);

    // da
    const deka = create_rat(10, 1);
    $.setBinding(create_sym("deka"), deka);

    // h
    const hecto = create_rat(100, 1);
    $.setBinding(create_sym("hecto"), hecto);

    // k
    const kilo = create_rat(1000, 1);
    $.setBinding(create_sym("kilo"), kilo);

    // M
    const mega = kilo.mul(kilo);
    $.setBinding(create_sym("mega"), mega);

    // G
    const giga = mega.mul(kilo);
    $.setBinding(create_sym("giga"), giga);

    // T
    const tera = giga.mul(kilo);
    $.setBinding(create_sym("tera"), tera);

    // P
    const peta = tera.mul(kilo);
    $.setBinding(create_sym("peta"), peta);

    // E
    const exa = peta.mul(kilo);
    $.setBinding(create_sym("exa"), exa);
}

class MicroEngine implements ExprEngine {
    readonly #env: ExtensionEnv;
    constructor(options: Partial<EngineConfig>) {
        this.#env = create_env({
            allowUndeclaredVars: allow_undeclared_vars(options, "Nil"),
            dependencies: ALL_FEATURES
        });
        init_env(this.#env, {
            allowUndeclaredVars: allow_undeclared_vars(options, "Nil"),
            useDerivativeShorthandLowerD: options.useDerivativeShorthandLowerD
        });
        define_math_constant_pi(this.#env);
        define_spacetime_algebra(this.#env);
        define_geometric30_algebra(this.#env);
        define_si_units(this.#env);
        define_metric_prefixes_for_si_units(this.#env);
    }
    defineUserSymbol(name: Sym): void {
        this.#env.defineUserSymbol(name);
    }
    handlerFor<T extends U>(expr: T): ExprHandler<T> {
        return this.#env.handlerFor(expr);
    }
    clearBindings(): void {
        this.#env.clearBindings();
    }
    hasBinding(opr: Sym, target: Cons): boolean {
        assert_sym(opr);
        return this.#env.hasBinding(opr, target);
    }
    getBinding(opr: Sym, target: Cons): U {
        assert_sym(opr);
        return this.#env.getBinding(opr, target);
    }
    setBinding(opr: Sym, binding: U): void {
        assert_sym(opr);
        this.#env.setBinding(opr, binding);
    }
    hasUserFunction(sym: Sym): boolean {
        assert_sym(sym);
        return this.#env.hasUserFunction(sym);
    }
    getUserFunction(sym: Sym): U {
        assert_sym(sym);
        return this.#env.getUserFunction(sym);
    }
    defineAtomHandler<T extends Atom>(builder: ExprHandlerBuilder<T>, type: string, guard: (expr: Atom) => boolean): void {
        const builderX = new AtomExtensionBuilderFromExprHandlerBuilder<T>(builder, type, guard);
        this.#env.defineExtension(builderX, false);
    }
    defineFunction(name: Sym, lambda: LambdaExpr): void {
        assert_sym(name);
        const match = items_to_cons(name);
        this.#env.defineFunction(match, lambda);
    }
    parse(sourceText: string): { trees: U[]; errors: Error[] } {
        const options: EmParseOptions = {
            useCaretForExponentiation: false,
            useParenForTensors: false
        };
        return em_parse(sourceText, options);
    }
    simplify(expr: U): U {
        return simplify(expr, this.#env);
    }
    valueOf(expr: U, stack?: Pick<ProgramStack, "push">): U {
        const { value } = transform_tree(expr, {}, this.#env);
        if (stack) {
            try {
                stack.push(value);
                return nil;
            } finally {
                value.release();
            }
        } else {
            // This seems harmless enough but it causes one unit test to hang.
            // return simplify(value, this.#env);
            return value;
        }
    }
    renderAsString(expr: U, config: Partial<RenderConfig> = {}): string {
        assert_U(expr);
        // console.lg("MicroEngine.renderAsString", `${expr}`);
        this.#env.pushDirective(Directive.useCaretForExponentiation, directive_from_flag(config.useCaretForExponentiation));
        this.#env.pushDirective(Directive.useParenForTensors, directive_from_flag(config.useParenForTensors));
        try {
            switch (config.format) {
                case "Ascii": {
                    return render_as_ascii(expr, this.#env);
                }
                case "Human": {
                    return render_as_human(expr, this.#env);
                }
                case "Infix": {
                    return render_as_infix(expr, this.#env);
                }
                case "LaTeX": {
                    return render_as_latex(expr, this.#env);
                }
                case "SExpr": {
                    return render_as_sexpr(expr, this.#env);
                }
                case "SVG": {
                    return render_svg(expr, this.#env, { useImaginaryI: false, useImaginaryJ: false });
                }
                default: {
                    return render_as_infix(expr, this.#env);
                }
            }
        } finally {
            this.#env.popDirective();
            this.#env.popDirective();
        }
    }
    release(): void {
        env_term(this.#env);
    }
    setUserFunction(name: Sym, userfunc: U): void {
        assert_sym(name);
        this.#env.setUserFunction(name, userfunc);
    }
    symbol(concept: Concept): Sym {
        switch (concept) {
            case Concept.Last: {
                return RESERVED_KEYWORD_LAST;
            }
            case Concept.TTY: {
                return RESERVED_KEYWORD_TTY;
            }
            default: {
                throw new Error(`symbol(${concept}) not implemented.`);
            }
        }
    }
    addCellListener(listener: CellListener): void {
        this.#env.addCellListener(listener);
    }
    removeCellListener(listener: CellListener): void {
        this.#env.removeCellListener(listener);
    }
    addListener(listener: ExprEngineListener): void {
        this.#env.listeners.push(listener);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    removeListener(listener: ExprEngineListener): void {}
    pushDirective(directive: number, value: number): void {
        this.#env.pushDirective(directive, value);
    }
    popDirective(): void {
        this.#env.popDirective();
    }
}

export function create_engine(options: Partial<EngineConfig> = {}): ExprEngine {
    return new MicroEngine(options);
}
