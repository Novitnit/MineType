//FUNCTION type
export type FUNCTION ={
    (): void;
} & {id: number};

//function
const stack:number[] = [];

// functionId 0 == Load
let functionId = 1;

//function to register a function
export function FUNCTION(fn: () => void):FUNCTION {
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