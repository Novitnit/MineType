import * as fs from "fs";
import { ScoreInternal, ScoreTable } from "./score";
import { allFunctions } from ".";

export function Debugger() {
    // console.log(JSON.stringify(allFunctions, null, 2));
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
    file.write(ScoreTable.map(score => `\t${ScoreInternal.isUsed(score.score) ? "🟢" : "🔴"}${score.name} : ${score.type}`).join("\n") + "\n\n");

    file.write("Command\n");
    for (const func of allFunctions) {
        file.write(`\tFUNCTION ID: ${func.id}\n`);
        for (const command of func.commands) {
            file.write(`\t\t`);
            switch (command.type) {
                case "ScoreAdd":{
                    file.write(`ScoreAdd `); 
                    file.write(`${command.selector.toString()} `)
                    file.write(`${ScoreInternal.getName(command.score)} `)
                    file.write(`${command.value} \n`)
                    break;
                }
                case "ScoreRemove":{
                    file.write(`ScoreRemove `); 
                    file.write(`${command.selector.toString()} `)
                    file.write(`${ScoreInternal.getName(command.score)} `)
                    file.write(`${command.value} \n`)
                    break;
                }
                case "ScoreSet": {
                    file.write(`ScoreSet `);
                    file.write(`${command.selector.toString()} `)
                    file.write(`${ScoreInternal.getName(command.score)} `)
                    file.write(`${command.value} \n`)
                    break;
                }
                case "ScoreReset": {
                    file.write(`ScoreReset`);
                    file.write(`${command.selector.toString()} `)
                    file.write(`${ScoreInternal.getName(command.score)} \n`)
                    break;
                }
                case "ScoreOperation": {
                    file.write(`ScoreOperation`);
                    file.write(` ${command.selector1.toString()} ${ScoreInternal.getName(command.score1)} `)
                    file.write(` ${command.operation} `)
                    file.write(` ${command.selector2.toString()} ${ScoreInternal.getName(command.score2)} \n`)
                    break;
                }
                case "ScoreEnable":{
                    file.write(`ScoreEnable `); 
                    file.write(`${command.selector.toString()} `)
                    file.write(`${ScoreInternal.getName(command.score)} \n`)
                    break;
                }
                case "CallFUNCTION":{
                    file.write(`CallFUNCTION ${command.functionId}\n`);
                    break;
                }
                case "Say":{
                    file.write(`say `);
                    file.write(`${command.message}`);
                    file.write("\n");
                    break;
                }
                case "Title":{
                    file.write(`${command.titleType} ${command.selector.toString()}`);
                    file.write(`${JSON.stringify(command.component)}`);
                    file.write("\n");
                    break;
                }
            }
        }
        if(func.commands.length === 0){
            file.write(`\t\t<No Commands>\n`);
        }
    }
    file.end();
}