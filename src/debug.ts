import * as fs from "fs";
import { ScoreInternal, ScoreTable } from "./command/score";
import { allFunctions, com, commandSym } from "./command";
import { chek_Config } from "./setUp";

// ------------------------------
// Helpers
// ------------------------------

function indent(level: number) {
    return "\t".repeat(level);
}

function write(file: fs.WriteStream, indentLevel: number, text: string) {
    file.write(indent(indentLevel) + text + "\n");
}

// ------------------------------
// Dispatch Function
// ------------------------------

function swCommand(file: fs.WriteStream, command: com, indentLevel = 0) {
    const indent = "\t".repeat(indentLevel);

    switch (command.type) {

        case "ScoreAdd":
            write(
                file,
                indentLevel,
                `ScoreAdd ${command.selector} ${ScoreInternal.getName(command.score)} ${command.value}`
            );
            break;

        case "ScoreRemove":
            write(
                file,
                indentLevel,
                `ScoreRemove ${command.selector} ${ScoreInternal.getName(command.score)} ${command.value}`
            );
            break;

        case "ScoreSet":
            write(
                file,
                indentLevel,
                `ScoreSet ${command.selector} ${ScoreInternal.getName(command.score)} ${command.value}`
            );
            break;

        case "ScoreReset":
            write(
                file,
                indentLevel,
                `ScoreReset ${command.selector} ${ScoreInternal.getName(command.score)}`
            );
            break;

        case "ScoreOperation":
            write(
                file,
                indentLevel,
                `ScoreOperation ${command.selector1} ${ScoreInternal.getName(command.score1)} ${command.operation} ${command.selector2} ${ScoreInternal.getName(command.score2)}`
            );
            break;

        case "ScoreEnable":
            write(
                file,
                indentLevel,
                `ScoreEnable ${command.selector} ${ScoreInternal.getName(command.score)}`
            );
            break;

        case "CallFUNCTION":
            write(
                file,
                indentLevel,
                `CallFUNCTION ${command.functionId}`
            );
            break;

        case "Say":
            write(
                file,
                indentLevel,
                `say ${command.message}`
            );
            break;

        case "Title":
            write(
                file,
                indentLevel,
                `${command.titleType} ${command.selector} ${JSON.stringify(command.component)}`
            );
            break;

        case "If_StemType":
            write(
                file,
                indentLevel,
                `If_StemType` +
                ` ${command.As ? `as ${command.As}`:""} `+
                `${command.At ? `at ${command.At}` : ""}`+
                `${command.In ? ` in ${command.In}` : ""}`
            );

            write(file, indentLevel + 1, `If Condition: (${command.if.condition.score} ` +
                `${command.if.condition.target} ` +
                `${command.if.condition.condition} ` +
                `${typeof command.if.condition.number === "number" ? command.if.condition.number : `${command.if.condition.number.score1} ${command.if.condition.number.selector1}`})`);
            
            write(file, indentLevel + 2, `Commands:`);

            for (const sub of command.if.commands) {
                swCommand(file, sub, indentLevel + 3);
            }

            if (command.elseIf) {
                for (const elseIf of command.elseIf) {
                    write(
                        file,
                        indentLevel + 1,
                        `ElseIf Condition: (${elseIf.condition.score} ` +
                        `${elseIf.condition.target} ` +
                        `${elseIf.condition.condition} ` +
                        `${typeof elseIf.condition.number === "number" ? elseIf.condition.number : `${elseIf.condition.number.score1} ${elseIf.condition.number.selector1}`})`
                    );
                    write(file, indentLevel + 2, `Commands:`);
                    for (const sub of elseIf.commands) {
                        swCommand(file, sub, indentLevel + 3);
                    }
                }
            }
            if (command.else) {
                write(file, indentLevel + 1, `Else:`);
                write(file, indentLevel + 2, `Commands:`);
                for (const sub of command.else) {
                    swCommand(file, sub, indentLevel + 3);
                }
            }

            break;

        default: {
            // Exhaustiveness check ทำให้ถ้า com มี type ใหม่ → error ตอน compile
            const _exhaustive: never = command;
            return _exhaustive;
        }
    }
}

// ------------------------------
// Debugger Main
// ------------------------------

export function Debugger() {
    const dir = process.cwd();
    const error = new Error();
    const stackLines = error.stack?.split("\n") || [];
    const callerLine = stackLines[2] || "";

    chek_Config();

    const match = callerLine.match(/file:\/\/\/(.*):\d+:\d+/);
    const FilePath = match ? match[1] : callerLine.trim();

    const file = fs.createWriteStream(`${dir}/debug.log`);
    file.write(`Debugger invoked from: ${FilePath}\n\n`);

    file.write("Current Score Table State:\n");
    file.write(
        ScoreTable.map(
            (score) =>
                `\t${ScoreInternal.isUsed(score.score) ? "🟢" : "🔴"}${
                    score.name
                } : ${score.type}`
        ).join("\n") + "\n\n"
    );

    file.write("Command\n");
    for (const func of allFunctions) {
        file.write(`\t${func.Name} Id:${func.id}\n`);

        if ((func as any)[commandSym].length === 0) {
            file.write(`\t\t<No Commands>\n`);
            continue;
        }

        for (const command of (func as any)[commandSym]) {
            swCommand(file, command, 2);
        }
    }

    file.end();
}