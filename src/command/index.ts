import { If_StemType } from "./excute/if";
import { IF_base } from "./excute/if/base";
import { CommandSay } from "./logs/say";
import { CommandTitle } from "./logs/title";
import { CommandScore } from "./score/children";
export { Debugger } from '../debug'
import fs from "fs";

//FUNCTION type
export interface FUNCTION {
    (): void;
    id: number;
}

//command
interface CallFUNCTION {
    type: "CallFUNCTION";
    functionId: number;
}

export type com = (
    | CommandScore
    | CallFUNCTION
    | CommandSay
    | CommandTitle
    | If_StemType
)

export type command = com[];

//command Return Types
export type commandReturnType = {
    type: "commandReturnType";
    command: command;
};

//function
export const allFunctions: FUNCTION[] = [];
export const commandSym = Symbol("command");
export type functionStackType = FUNCTION | IF_base ;

export class FUNCTION {
    static Id = 2;
    static functionStack: functionStackType[] = [];

    static nextId (){
        return this.Id++;
    }

    static removeId (){
        this.Id--;
    }
    id: number;
    [commandSym]: command = [];
    Name: string;

    constructor(fn: () => void) {
        this.id = FUNCTION.nextId();
        this.Name = `function_${this.id}`;

        const error = new Error()
        const stackLines = error.stack?.split("\n") || [];
        const callerLine = stackLines[2] || "";
        const match = callerLine.match(/file:\/\/\/(.*):(\d+):\d+/);
        if (match) {
            const filePath = match[1] as string;
            const lineNumber = match[2];
            const line = fs.readFileSync(filePath, "utf-8").split("\n")[Number(lineNumber) - 1] as string;
            const matchName = line.match(/const (\w+) =/)
            const name = matchName ? matchName[1] as string : `function_${this.id}`;

            this.Name = name;
        }

        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        allFunctions.push(this);

        const self = this as unknown as FUNCTION;
        Object.setPrototypeOf(self, FUNCTION.prototype);

        const callable = function () {
            const fn = FUNCTION.functionStack.at(-1);
            if (!fn) throw new Error("FUNCTION called outside FUNCTION()");
            (fn as any)[commandSym].push({
                type: "CallFUNCTION",
                functionId: self.id
            });
        } as FUNCTION;
        Object.assign(callable, self);
        
        callable.id = this.id;

        return callable;
    }
}

function createLoadFunction() {
    const f = Object.create(FUNCTION.prototype) as FUNCTION;
    f.id = 0;
    (f as any)[commandSym] = [];
    f.Name = "load_function";
    allFunctions.push(f);
    return f;
}

function createTickFunction() {
    const f = Object.create(FUNCTION.prototype) as FUNCTION;
    f.id = 1;
    (f as any)[commandSym] = [];
    f.Name = "tick_function";
    allFunctions.push(f);
    return f;
}

createLoadFunction();
createTickFunction();

export { Score } from './score'
export * from './logs'
export { self, nearestPlayer, randomPlayer, allPlayers, regPlayer, allEntities } from './Argument/selectors'
export { SlotType } from './Argument'
export * from './excute'