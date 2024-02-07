import { ScriptOutputListener } from "./eigenmath";

export interface ProgramIO {
    get inbuf(): string;
    set inbuf(inbuf: string);
    get listeners(): ScriptOutputListener[];
    get trace1(): number;
    set trace1(trace1: number);
    get trace2(): number;
    set trace2(trace2: number);
}