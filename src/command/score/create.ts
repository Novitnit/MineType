import { Score, ScoreTable } from ".";
import { ScoreCriteria } from "../Argument/score/Criteria";

export function createScore(name: string, type: ScoreCriteria, score:Score) {
    // Implementation for creating a score in the system

    ScoreTable.push({
        name: name,
        type: type,
        score: score
    });
}