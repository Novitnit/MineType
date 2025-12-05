import { allFunctions, command, commandSym, FUNCTION } from "./command";
import fs from "fs";

interface ConfigOptions {
    name: string;
    version: "1.21.1";
    load: FUNCTION[];
    tick: FUNCTION[];
}

export let configI:boolean = false;

export const config: ConfigOptions = {
    name: "",
    version: "1.21.1",
    load: [],
    tick: []
};

export function Config(options: ConfigOptions) {
    configI = true;
    config.name = options.name;
    config.version = options.version;
    config.load = options.load;
    config.tick = options.tick;

    (allFunctions[0] as any)[commandSym] ||= [];
    (allFunctions[1] as any)[commandSym] ||= [];
    for(const func of config.load){
        ((allFunctions[0] as any)[commandSym] as command).push({
            type:"CallFUNCTION",
            functionId: func.id
        });
    }

    for(const func of config.tick){
        ((allFunctions[1] as any)[commandSym] as command).push({
            type:"CallFUNCTION",
            functionId: func.id
        });
    }

}

export function chek_Config() {
    if(!configI){
        const error = new Error()
        const stackLines = error.stack?.split("\n");
        const callerLine = stackLines ? stackLines[3] as string : "";
        const match = callerLine.match(/file:\/\/\/(.*):\d+:\d+/);
        const filePath = match ? match[1] as string : "unknown file";

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const fileLines = fileContent.split("\n");

        let insertIndex = -1;
        for (let i = 0; i < fileLines.length; i++) {
            if ((fileLines[i] as string).includes("Debugger()")) {
                insertIndex = i;
                break;
            }
        }

        if (insertIndex === -1) return;

        const insertText = `Config({
    name: "${filePath.split("/").pop()?.split(".")[0] || "MyMod"}",
    version: "1.21.1",
    load: [],
    tick: []
})
`;
        fileLines.splice(insertIndex, 0, insertText);

        fs.writeFileSync(filePath, fileLines.join("\n"), "utf-8");
    }
}
