import { create_sym, Sym } from "math-expression-atoms";
import { is_native_sym } from "math-expression-native";
import { is_nil, U } from "math-expression-tree";
import { get_binding, iszero, ScriptContentHandler, ScriptOutputListener, ScriptVars } from "./eigenmath";
import { isimaginaryunit } from "./isimaginaryunit";
import { print_value_and_input_as_svg_or_infix } from "./print_value_and_input_as_svg_or_infix";
import { EmitContext } from "./render_svg";

const I_LOWER = create_sym("i");
const J_LOWER = create_sym("j");
const TTY = create_sym("tty");

class PrintScriptOutputListener implements ScriptOutputListener {
    // TODO: only stdout needed here.
    // TOOD: May be the proper place for escaping.
    constructor(private readonly outer: PrintScriptContentHandler) {
        this.outer.stdout.innerHTML = "";
    }
    output(output: string): void {
        this.outer.stdout.innerHTML += output;
    }

}

class PrintScriptContentHandler implements ScriptContentHandler {
    private readonly listener: PrintScriptOutputListener;
    constructor(readonly stdout: HTMLElement) {
        this.listener = new PrintScriptOutputListener(this);
    }
    begin($: ScriptVars): void {
        $.addOutputListener(this.listener);
    }
    end($: ScriptVars): void {
        $.removeOutputListener(this.listener);
    }
    output(value: U, input: U, $: ScriptVars): void {
        const ec: EmitContext = {
            useImaginaryI: isimaginaryunit(get_binding(I_LOWER, $)),
            useImaginaryJ: isimaginaryunit(get_binding(J_LOWER, $))
        };
        function should_annotate_symbol(x: Sym, value: U): boolean {
            if ($.hasUserFunction(x)) {
                if (x.equals(value) || is_nil(value)) {
                    return false;
                }
                /*
                if (x.equals(I_LOWER) && isimaginaryunit(value))
                    return false;
        
                if (x.equals(J_LOWER) && isimaginaryunit(value))
                    return false;
                */

                return true;
            }
            else {
                if (is_native_sym(x)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
        print_value_and_input_as_svg_or_infix(value, input, should_render_svg($), ec, [this.listener], should_annotate_symbol);
    }
}

function should_render_svg($: ScriptVars): boolean {
    const tty = get_binding(TTY, $);
    if (tty.equals(TTY) || iszero(tty)) {
        return true;
    }
    else {
        return false;
    }
}

