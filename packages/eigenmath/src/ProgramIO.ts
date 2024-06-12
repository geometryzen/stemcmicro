export interface ProgramIOListener {
    output(output: string): void;
}

export interface ProgramIO {
    get inbuf(): string;
    set inbuf(inbuf: string);
    get listeners(): ProgramIOListener[];
    get trace1(): number;
    set trace1(trace1: number);
    get trace2(): number;
    set trace2(trace2: number);
}
