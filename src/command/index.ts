import { CommandScore } from "./score/children";
export { Debugger } from './debug'

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
type command = (
    | CommandScore
    | CallFUNCTION
)[];

//function
export const allFunctions: FUNCTION[] = [];

export class FUNCTION {
    static nextId = 1;
    static functionStack: FUNCTION[] = [];

    id: number;
    commands: command = [];

    constructor(fn: () => void) {
        this.id = FUNCTION.nextId++;
        FUNCTION.functionStack.push(this);
        fn();
        FUNCTION.functionStack.pop();
        allFunctions.push(this);

        const self = this as unknown as FUNCTION;
        Object.setPrototypeOf(self, FUNCTION.prototype);

        const callable = function () {
            const fn = FUNCTION.functionStack.at(-1);
            if (!fn) throw new Error("FUNCTION called outside FUNCTION()");
            fn.commands.push({
                type: "CallFUNCTION",
                functionId: self.id
            });
        } as FUNCTION;
        Object.assign(callable, self);

        return callable;
    }

    addCommand(command: command) {
        this.commands.push(...command);
    }

}

export { Score } from './score'
export { self, nearestPlayer, randomPlayer, allPlayers, regPlayer, allEntities } from './Argument/selectors'
