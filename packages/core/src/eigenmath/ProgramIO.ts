import { ExprEngineListener } from "../api/api";

export interface ProgramIO {
    get inbuf(): string;
    set inbuf(inbuf: string);
    get listeners(): ExprEngineListener[];
    get trace1(): number;
    set trace1(trace1: number);
    get trace2(): number;
    set trace2(trace2: number);
}
