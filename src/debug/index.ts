import { allFunctions, com, command, commandSym } from "../command";
import { kUsed, ScoreTable } from "../command/score";
import { chek_Config } from "../setUp";
import fs from "fs";
import { BaseWriter } from "./command";
import { scoreWriters } from "./command/score";
import { logWriters } from "./command/log";
import { If_stem } from "./command/if";

export class Debugger {
    protected file: fs.WriteStream;
    public indentLevel: number = 0;
    private writers: BaseWriter[] = [
        new CallFUNCTION(this),
    ];

    constructor() {
        const dir = process.cwd();
        const error = new Error();
        const stackLines = error.stack?.split("\n") || [];
        const callerLine = stackLines[2] || "";
        chek_Config();
        const match = callerLine.match(/file:\/\/\/(.*):\d+:\d+/);
        const FilePath = match ? match[1] : callerLine.trim();
        this.file = fs.createWriteStream(`${dir}/debug.log`);
        this.write(`Debug Log for ${FilePath}\n`);
        this.writers.push(...scoreWriters(this));
        this.writers.push(...logWriters(this));
        this.writers.push(new If_stem(this));

        this.writeScoreTable();
        this.writeCommands();

    }

    public write(text: string) {
        this.file.write("\t".repeat(this.indentLevel) + text + "\n");
    }

    private writeCommands() {
        this.write("Command");
        this.indentLevel++;
        for (const func of allFunctions) {
            this.write(`${func.Name} Id:${func.id}`);
            this.writeCommand(func[commandSym]);
        }
        this.indentLevel--;
    }

    public writeCommand(commands: command) {
        this.indentLevel++;
        if (commands === undefined || commands.length === 0) {
            this.write("<No Command>");
            this.indentLevel--;
            return;
        }
        for (const command of commands) {
            for (const writer of this.writers) {
                if (writer.match(command)) {
                    writer.write(command);
                }
            }
        }
        this.indentLevel--;
    }

    private writeScoreTable() {
        this.write("Current Score Table State:");
        this.indentLevel++;

        for (const score of ScoreTable) {
            this.write(
                `${score.score[kUsed] ? "🟢" : "🔴"}${score.name} : ${score.type}`
            );
        }

        this.indentLevel--;
        this.write("");
    }
}

export class CallFUNCTION extends BaseWriter {
    match(c: com): boolean {
        return c.type === "CallFUNCTION";
    }

    write(c: com): void {
        if (c.type !== "CallFUNCTION") return;
        this.dbg.write(`CallFUNCTION ${c.functionId}`);
    }
}