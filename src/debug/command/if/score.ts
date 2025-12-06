import { ScoreConditionType } from "../../../command/excute/if/scoreConditions";
import { kName } from "../../../command/score";

export function scoreCondition(c: ScoreConditionType) {
    const not = c.not ? "not " : "";
    if(typeof c.value === "number") {
        return `${not}score ${c.score[kName]} ${c.target} ${c.condition} ${c.value}`;
    }else{
        return `${not}score ${c.score[kName]} ${c.target} ${c.condition} ${c.value.score[kName]} of ${c.value.target}`;
    }
}