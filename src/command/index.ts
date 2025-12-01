import * as fs from "fs";
import { ScoreTable } from "./score";
import { CommandScore } from "./score/children";

//FUNCTION type
export type FUNCTION = {
    (): void;
} & { id: number };

//command
type command = (
    |CommandScore

)[];

//function
export const stack: number[] = [];
export const commandStack: command[] = [];

// functionId 0 == Load
let functionId = 1;

//function to register a function
export function FUNCTION(fn: () => void): FUNCTION {
    const id = functionId++;
    stack.push(id);
    fn();
    stack.pop();

    const call = function () {
        console.log(`Function ID: ${id} called.`);
    } as FUNCTION;

    call.id = id;

    return call;
}

export { Score } from './score'
export { self, nearestPlayer, randomPlayer, allPlayers, allEntities } from './Argument/selectors'

export function Debugger() {
    // console.log(JSON.stringify(ScoreTable, null, 2));
    const dir = process.cwd();
    const error = new Error();
    const stackLines = error.stack?.split("\n") || [];
    const callerLine = stackLines[2] || "";

    const match = callerLine.match(/file:\/\/\/(.*):\d+:\d+/);

    const FilePath = match ? match[1] : callerLine.trim();

    // console.log(`Debugger invoked from: ${FilePath}`);
    const file = fs.createWriteStream(`${dir}/debug.log`);
    file.write(`Debugger invoked from: ${FilePath}\n\n`);
    file.write("Current Score Table State:\n");
    file.write(ScoreTable.map(score => `\t${score.score.used ? "🟢" : "🔴"}${score.name} : ${score.type}`).join("\n") + "\n\n");

    file.write("Command\n");
    for (let i = 0; i < commandStack.length; i++) {
        file.write("\t");
        file.write(`Function ID: ${i}\n`);
        const commands = commandStack[i];
        if (!commands) continue;
        for (const command of commands) {
            file.write("\t\t");
            switch (command.type) {
                case "ScoreAdd": {
                    file.write(`Score Add: ${command.selector.toString()} ${command.score['name']} ${command.value}\n`);
                    break;
                }
                case "ScoreRemove": {
                    file.write(`Score Remove: ${command.selector.toString()} ${command.score['name']} ${command.value}\n`);
                    break;
                }
                case "ScoreSet": {
                    file.write(`Score Set: ${command.selector.toString()} ${command.score['name']} ${command.value}\n`);
                    break;
                }
                case "ScoreReset":{
                    file.write(`Score Reset: ${command.selector.toString()} ${command.score['name']}\n`);
                    break;
                }
                case "ScoreOperation":{
                    file.write(`Score Operation: ${command.selector1.toString()} ${command.score1['name']} ${command.operation} ${command.selector2.toString()} ${command.score2['name']}\n`);
                    break;
                }
            }
        }
        file.write("\n");
    }
    file.end();
}