import * as fs from "fs";
import { ScoreTable } from "./score";

//FUNCTION type
export type FUNCTION = {
    (): void;
} & { id: number };

//function
const stack: number[] = [];

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
    file.write(ScoreTable.map(score => `${score.score.used ? "🟢" : "🔴"}${score.name} : ${score.type}`).join("\n") + "\n");
    file.end();
}