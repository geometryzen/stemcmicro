import { assert_rat, assert_sym, create_flt, create_sym, Flt, is_err, is_imu, is_num, is_tensor, Sym } from "@stemcmicro/atoms";
import { assert_cons, Cons, nil, U } from "@stemcmicro/tree";
import { ExprContextFromProgram } from "../adapters/ExprContextFromProgram";
import { StackFunction } from "../adapters/StackFunction";
import { Directive } from "../env/ExtensionEnv";
import { broadcast, evaluate_nonstop, floatfunc, get_binding, lookup, restore_symbol, save_symbol, set_symbol, value_of } from "./eigenmath";
import { ProgramControl } from "./ProgramControl";
import { ProgramEnv } from "./ProgramEnv";
import { ProgramIO } from "./ProgramIO";
import { ProgramStack } from "./ProgramStack";
import { draw_formula, emit_list, height, set_emit_small_font, SvgRenderConfig, SvgRenderEnv, width } from "./render_svg";

interface DrawContext {
    /**
     * Usually -Math.PI.
     */
    tmin: number;
    /**
     * Usually, +Math.PI
     */
    tmax: number;
    /**
     * -10
     */
    xmin: number;
    /**
     * +10
     */
    xmax: number;
    /**
     * -10
     */
    ymin: number;
    /**
     * +10
     */
    ymax: number;
}

const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");
// const X_LOWER = create_sym("x");

const DRAW_LEFT_PAD = 200;
const DRAW_RIGHT_PAD = 100;

const DRAW_TOP_PAD = 10;
const DRAW_BOTTOM_PAD = 40;

const DRAW_XLABEL_BASELINE = 30;
const DRAW_YLABEL_MARGIN = 15;

function draw_args(argList: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): [F: U, varName: Sym, n: number, pass2: boolean] {
    // The following illustrates how using stack operations can avoid the need for explicit reference counting code.
    // Whenever a pop happens, the popped item should either be returned or released.
    // Keeping track of the stack contents is difficult but can be aided by inline comment documentation.
    $.push(argList); // (argList)
    $.dupl(); // (argList, argList)
    $.head(); // (arg0, argList)
    const F = $.pop(); // (argList)
    $.rest(); // (argList.rest)
    $.dupl(); // (argList.rest, argList.rest)
    $.head(); // (arg1, argList.rest)
    const varName = assert_sym($.pop()); // (argList.rest)
    $.rest(); // (argList.rest.rest)
    $.dupl(); // (argList.rest.rest, argList.rest.rest)
    $.head(); // (arg2, argList.rest.rest)
    value_of(env, ctrl, $); // (val2, argList.rest.rest)
    const N = $.pop(); // (argList.rest.rest)
    $.rest(); // (argList.rest.rest.rest)
    $.pop(); // ()
    // TODO: Perom a null check on the previously popped item.
    try {
        if (N.isnil) {
            return [F, varName, DRAW_WIDTH + 1, true];
        } else {
            return [F, varName, assert_rat(N).toNumber(), false];
        }
    } finally {
        N.release();
    }
}

export function make_stack_draw(io: Pick<ProgramIO, "listeners">): StackFunction {
    return function (expr: Cons, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack): void {
        assert_cons(expr);
        if (ctrl.getDirective(Directive.drawing)) {
            // Do nothing
        } else {
            const exprContext = new ExprContextFromProgram(env, ctrl);
            ctrl.pushDirective(Directive.drawing, 1);
            try {
                const [F, varName, n, pass2] = draw_args(expr.argList, env, ctrl, $);
                /*
                if (!(is_sym(T) && env.hasUserFunction(T))) {
                    T = X_LOWER;
                }
                */

                // The approach here is to save and restore the varName symbol.
                // What we really should be doing is to create a new derived scope.
                save_symbol(assert_sym(varName), env);
                try {
                    const dc: DrawContext = {
                        tmax: +Math.PI,
                        tmin: -Math.PI,
                        xmax: +10,
                        xmin: -10,
                        ymax: +10,
                        ymin: -10
                    };
                    setup_trange(env, ctrl, $, dc);
                    setup_xrange(env, ctrl, $, dc);
                    setup_yrange(env, ctrl, $, dc);

                    setup_final(F, assert_sym(varName), env, ctrl, $, dc);

                    const points: { t: number; x: number; y: number }[] = [];

                    // TODO: Why do we use the theta range? How do we ensure integrity across function calls?
                    draw_pass1(F, varName, n, points, env, ctrl, $, dc);
                    if (pass2) {
                        draw_pass2(F, varName, points, env, ctrl, $, dc);
                    }

                    const outbuf: string[] = [];

                    const ec: SvgRenderConfig = {
                        useImaginaryI: is_imu(get_binding(I_LOWER, nil, env)),
                        useImaginaryJ: is_imu(get_binding(J_LOWER, nil, env))
                    };
                    emit_graph(points, exprContext, $, dc, ec, outbuf);

                    const output = outbuf.join("");

                    broadcast(output, io);
                } finally {
                    restore_symbol(env);
                }
            } finally {
                ctrl.popDirective();
            }
        }

        $.push(nil); // return value
    };
}

function setup_trange(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    dc.tmin = -Math.PI;
    dc.tmax = +Math.PI;

    let p1: U = lookup(create_sym("trange"), env);
    $.push(p1);
    evaluate_nonstop(env, ctrl, $);
    floatfunc(env, ctrl, $);
    p1 = $.pop()!;

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2) return;

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3)) {
        return;
    }

    dc.tmin = p2.toNumber();
    dc.tmax = p3.toNumber();
}

function setup_xrange(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    dc.xmin = -10;
    dc.xmax = +10;

    let p1: U = lookup(create_sym("xrange"), env);
    $.push(p1);
    evaluate_nonstop(env, ctrl, $);
    floatfunc(env, ctrl, $);
    p1 = $.pop()!;

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2) {
        return;
    }

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3)) return;

    dc.xmin = p2.toNumber();
    dc.xmax = p3.toNumber();
}

function setup_yrange(env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    dc.ymin = -10;
    dc.ymax = +10;

    let p1: U = lookup(create_sym("yrange"), env);
    $.push(p1);
    evaluate_nonstop(env, ctrl, $);
    floatfunc(env, ctrl, $);
    p1 = $.pop()!;

    if (!is_tensor(p1) || p1.ndim !== 1 || p1.dims[0] !== 2) {
        return;
    }

    const p2 = p1.elems[0];
    const p3 = p1.elems[1];

    if (!is_num(p2) || !is_num(p3)) return;

    dc.ymin = p2.toNumber();
    dc.ymax = p3.toNumber();
}

function draw_pass1(F: U, varName: Sym, n: number, points: { t: number; x: number; y: number }[], env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    const n_minus_one = n - 1;
    for (let i = 0; i < n; i++) {
        const t = dc.tmin + ((dc.tmax - dc.tmin) * i) / n_minus_one;
        sample(F, varName, t, points, env, ctrl, $, dc);
    }
}

function draw_pass2(F: U, varName: Sym, points: { t: number; x: number; y: number }[], env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    const n = points.length - 1;

    for (let i = 0; i < n; i++) {
        const t1 = points[i].t;
        const t2 = points[i + 1].t;

        const x1 = points[i].x;
        const x2 = points[i + 1].x;

        const y1 = points[i].y;
        const y2 = points[i + 1].y;

        if (!inrange(x1, y1) && !inrange(x2, y2)) {
            continue;
        }

        const dt = t2 - t1;
        const dx = x2 - x1;
        const dy = y2 - y1;

        const m = Math.floor(Math.sqrt(dx * dx + dy * dy));

        for (let j = 1; j < m; j++) {
            const t = t1 + (dt * j) / m;
            sample(F, varName, t, points, env, ctrl, $, dc);
        }
    }
}

function setup_final(F: U, varName: Sym, env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    set_symbol(varName, create_flt(dc.tmin), nil, env);

    $.push(F);
    evaluate_nonstop(env, ctrl, $);
    const Fmin = $.pop();

    if (!is_tensor(Fmin)) {
        dc.tmin = dc.xmin;
        dc.tmax = dc.xmax;
    }
}

function sample(funcExpr: U, varName: Sym, t: number, points: { t: number; x: number; y: number }[], env: ProgramEnv, ctrl: ProgramControl, $: ProgramStack, dc: DrawContext): void {
    $.push(funcExpr);
    value_of(env, ctrl, $);
    const F = $.pop();
    try {
        let X: U = create_flt(t);

        set_symbol(assert_sym(varName), X, nil, env);

        $.push(F);
        value_of(env, ctrl, $);
        const temp = $.pop();
        if (is_err(temp)) {
            return;
        } else {
            // The following appears to be redundant because temp is already a Flt.
            $.push(temp);
            // eval_nonstop(env, ctrl, $);
            floatfunc(env, ctrl, $);
            let Y = $.pop();
            try {
                if (is_tensor(Y)) {
                    X = Y.elems[0];
                    Y = Y.elems[1];
                }

                if (!is_num(X) || !is_num(Y)) {
                    return;
                }

                const x = X.toNumber();
                const y = Y.toNumber();

                if (!isFinite(x) || !isFinite(y)) {
                    return;
                }

                const px = (DRAW_WIDTH * (x - dc.xmin)) / (dc.xmax - dc.xmin);
                const py = (DRAW_HEIGHT * (y - dc.ymin)) / (dc.ymax - dc.ymin);

                const point = { t: t, x: px, y: py };

                points.push(point);
            } finally {
                Y.release();
            }
        }
    } finally {
        F.release();
    }
}

function emit_graph(draw_array: { t: number; x: number; y: number }[], env: SvgRenderEnv, $: ProgramStack, dc: DrawContext, ec: SvgRenderConfig, outbuf: string[]): void {
    const h = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_BOTTOM_PAD;
    const w = DRAW_LEFT_PAD + DRAW_WIDTH + DRAW_RIGHT_PAD;

    const heq = "height='" + h + "'";
    const weq = "width='" + w + "'";

    outbuf.push("<svg " + heq + weq + ">");

    emit_axes(dc, outbuf);
    emit_box(dc, outbuf);
    emit_labels(env, $, dc, ec, outbuf);
    emit_points(draw_array, dc, outbuf);

    outbuf.push("</svg>");
}

function emit_axes(dc: DrawContext, outbuf: string[]): void {
    const x = 0;
    const y = 0;

    const dx = (DRAW_WIDTH * (x - dc.xmin)) / (dc.xmax - dc.xmin);
    const dy = DRAW_HEIGHT - (DRAW_HEIGHT * (y - dc.ymin)) / (dc.ymax - dc.ymin);

    if (dx > 0 && dx < DRAW_WIDTH) {
        draw_line(dx, 0, dx, DRAW_HEIGHT, 0.5, outbuf); // vertical axis
    }

    if (dy > 0 && dy < DRAW_HEIGHT) {
        draw_line(0, dy, DRAW_WIDTH, dy, 0.5, outbuf); // horizontal axis
    }
}

function emit_box(dc: DrawContext, outbuf: string[]): void {
    const x1 = 0;
    const x2 = DRAW_WIDTH;

    const y1 = 0;
    const y2 = DRAW_HEIGHT;

    draw_line(x1, y1, x2, y1, 0.5, outbuf); // top line
    draw_line(x1, y2, x2, y2, 0.5, outbuf); // bottom line

    draw_line(x1, y1, x1, y2, 0.5, outbuf); // left line
    draw_line(x2, y1, x2, y2, 0.5, outbuf); // right line
}

function emit_labels(env: SvgRenderEnv, $: ProgramStack, dc: DrawContext, ec: SvgRenderConfig, outbuf: string[]): void {
    set_emit_small_font();
    emit_list(new Flt(dc.ymax), env, $, ec);
    const YMAX = $.pop()!;
    let x = DRAW_LEFT_PAD - width(YMAX) - DRAW_YLABEL_MARGIN;
    let y = DRAW_TOP_PAD + height(YMAX);
    draw_formula(x, y, YMAX, outbuf);

    set_emit_small_font();
    emit_list(new Flt(dc.ymin), env, $, ec);
    const YMIN = $.pop();
    x = DRAW_LEFT_PAD - width(YMIN) - DRAW_YLABEL_MARGIN;
    y = DRAW_TOP_PAD + DRAW_HEIGHT;
    draw_formula(x, y, YMIN, outbuf);

    set_emit_small_font();
    emit_list(new Flt(dc.xmin), env, $, ec);
    const XMIN = $.pop();
    x = DRAW_LEFT_PAD - width(XMIN) / 2;
    y = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_XLABEL_BASELINE;
    draw_formula(x, y, XMIN, outbuf);

    set_emit_small_font();
    emit_list(new Flt(dc.xmax), env, $, ec);
    const XMAX = $.pop();
    x = DRAW_LEFT_PAD + DRAW_WIDTH - width(XMAX) / 2;
    y = DRAW_TOP_PAD + DRAW_HEIGHT + DRAW_XLABEL_BASELINE;
    draw_formula(x, y, XMAX, outbuf);
}

function emit_points(points: { t: number; x: number; y: number }[], $: DrawContext, outbuf: string[]): void {
    const n = points.length;

    for (let i = 0; i < n; i++) {
        const x = points[i].x;
        const y = points[i].y;

        if (inrange(x, y)) {
            const cx = x + DRAW_LEFT_PAD;
            const cy = DRAW_HEIGHT - y + DRAW_TOP_PAD;

            const cxeq = `cx='${cx}'`;
            const cyeq = `cy='${cy}'`;

            outbuf.push(`<circle ${cxeq} ${cyeq} r='1.5' style='stroke:black;fill:black'/>`);
        }
    }
}

function draw_line(x1: number, y1: number, x2: number, y2: number, strokeWidth: number, outbuf: string[]): void {
    x1 += DRAW_LEFT_PAD;
    x2 += DRAW_LEFT_PAD;

    y1 += DRAW_TOP_PAD;
    y2 += DRAW_TOP_PAD;

    const x1eq = "x1='" + x1 + "'";
    const x2eq = "x2='" + x2 + "'";

    const y1eq = "y1='" + y1 + "'";
    const y2eq = "y2='" + y2 + "'";

    outbuf.push(`<line ${x1eq} ${y1eq} ${x2eq} ${y2eq} style='stroke:black;stroke-width:${strokeWidth}'/>`);
}

const DRAW_WIDTH = 300;
const DRAW_HEIGHT = 300;

export function inrange(x: number, y: number): boolean {
    return x > -0.5 && x < DRAW_WIDTH + 0.5 && y > -0.5 && y < DRAW_HEIGHT + 0.5;
}
