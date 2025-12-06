import { WriteStream } from "fs";
import { BaseWriter } from ".";
import { com } from "../../command";
import { kName } from "../../command/score";
import { count } from "console";
import { Debugger } from "..";

export class scoreAdd extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreAdd";
    }

    write(c: com): void {
        if (c.type !== "ScoreAdd") return;
        this.dbg.write(`ScoreAdd ${c.selector} ${c.score[kName]} ${c.value}`);
    }
}

export class scoreRemove extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreRemove";
    }
    write(c: com): void {
        if (c.type !== "ScoreRemove") return;
        this.dbg.write(`ScoreRemove ${c.selector} ${c.score[kName]} ${c.value}`);
    }
}

export class scoreSet extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreSet";
    }
    write(c: com): void {
        if (c.type !== "ScoreSet") return;
        this.dbg.write(`ScoreSet ${c.selector} ${c.score[kName]} ${c.value}`);
    }
}

export class scoreReset extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreReset";
    }
    write(c: com): void {
        if (c.type !== "ScoreReset") return;
        this.dbg.write(`ScoreReset ${c.selector} ${c.score[kName]}`);
    }
}

export class scoreOperation extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreOperation";
    }
    write(c: com): void {
        if (c.type !== "ScoreOperation") return;
        this.dbg.write(
            `ScoreOperation ${c.selector1} ${c.score1[kName]} ${c.operation} ${c.selector2} ${c.score2[kName]}`
        );
    }
}

export class scoreEnable extends BaseWriter {
    match(command: com): boolean {
        return command.type === "ScoreEnable";
    }

    write(c: com): void {
        if (c.type !== "ScoreEnable") return;
        this.dbg.write(`ScoreEnable ${c.selector} ${c.score[kName]}`);
    }
}

export const scoreWriters = (k: Debugger) => [
    new scoreAdd(k),
    new scoreRemove(k),
    new scoreSet(k),
    new scoreReset(k),
    new scoreOperation(k),
    new scoreEnable(k),
];