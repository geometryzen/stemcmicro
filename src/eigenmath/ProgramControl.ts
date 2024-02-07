export interface ProgramControl {
    get drawing(): number;
    set drawing(drawing: number);
    get eval_level(): number;
    set eval_level(eval_level: number);
    get expanding(): number;
    set expanding(expanding: number);
    get nonstop(): number;
    set nonstop(nonstop: number);
}