import {update} from "../pool";
import {ScormRuntimeInteraction} from "../../scorm/types";
import {RuntimeInteraction} from "../model/runtime_interactions";


const insertRuntimeInteraction = async (runtimeInteraction: RuntimeInteraction) => {
    try {

        const insertQuery = `
            INSERT INTO runtime_interaction (id,
                                             runtime_id,
                                             type,
                                             objectives,
                                             timestamp,
                                             timestamp_utc,
                                             correct_responses,
                                             weighting,
                                             learner_response,
                                             result,
                                             latency,
                                             description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY
                UPDATE runtime_id      = VALUES(runtime_id),
                       type = VALUES(type),
                       objectives = VALUES(objectives),
                       timestamp = VALUES(timestamp),
                       timestamp_utc = VALUES(timestamp_utc),
                       correct_responses = VALUES(correct_responses),
                       weighting = VALUES(weighting),
                       learner_response  = VALUES(learner_response),
                       result  = VALUES(result),
                       latency  = VALUES(latency),
                       description  = VALUES(description);
        `;

        const params = [
            runtimeInteraction.id,
            runtimeInteraction.runtime_id,
            runtimeInteraction.type,
            runtimeInteraction.objectives,
            runtimeInteraction.timestamp || null,
            runtimeInteraction.timestamp_utc || null,
            runtimeInteraction.correct_responses,
            runtimeInteraction.weighting,
            runtimeInteraction.learner_response,
            runtimeInteraction.result,
            runtimeInteraction.latency,
            runtimeInteraction.description || null,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const scormRuntimeInteraction2RuntimeInteractionTransformer = (
    scormRuntime: ScormRuntimeInteraction,
    runtime_id: number
): RuntimeInteraction => {
    return {
        id: scormRuntime.id,
        runtime_id,
        correct_responses: scormRuntime.correctResponses.join(', '),
        latency: scormRuntime.latency,
        description: scormRuntime.description,
        learner_response: scormRuntime.learnerResponse,
        result: scormRuntime.result,
        objectives: scormRuntime.objectives.join(', '),
        type: scormRuntime.type,
        timestamp: scormRuntime.timestamp,
        timestamp_utc: scormRuntime.timestampUtc,
        weighting: scormRuntime.weighting,
    }
}

export const processScormRuntimeInteraction = async (
    scormRuntimeInteraction: ScormRuntimeInteraction,
    runtimeId: number
) => {
    await insertRuntimeInteraction(scormRuntimeInteraction2RuntimeInteractionTransformer(
        scormRuntimeInteraction,
        runtimeId
    ));
}