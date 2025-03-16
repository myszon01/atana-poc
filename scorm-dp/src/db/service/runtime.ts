import {queryWithValidation, update} from "../pool";
import {ScormRuntime} from "../../scorm/types";
import {Runtime} from "../model/runtime";
import {z} from "zod";
import {processScormRuntimeInteraction} from "./runtime_interaction";

const getRuntime = async (
    registration_activity_id: number
) => {
    try {

        const query = `
            SELECT ID FROM runtime WHERE registration_activity_id = ?;
        `
        const params = [registration_activity_id];

        const res = await queryWithValidation(query, params, z.object({
            ID: z.number()
        }));
        return res[0].ID;

    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const insertRuntime = async (runtime: Runtime) => {
    try {

        const insertQuery = `
            INSERT INTO runtime (registration_activity_id,
                                 completion_status,
                                 credit,
                                 exit_val,
                                 learner_preference_audio_lvl,
                                 learner_preference_lang,
                                 learner_preference_delivery_speed,
                                 learner_preference_audio_captioning,
                                 location,
                                 mode,
                                 progress_measure,
                                 score_scaled,
                                 score_raw,
                                 score_min,
                                 score_max,
                                 total_time,
                                 time_tracked,
                                 runtime_success_status,
                                 entry)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY
                UPDATE completion_status      = VALUES(completion_status),
                       credit = VALUES(credit),
                       exit_val = VALUES(exit_val),
                       learner_preference_audio_lvl = VALUES(learner_preference_audio_lvl),
                       learner_preference_lang = VALUES(learner_preference_lang),
                       learner_preference_delivery_speed = VALUES(learner_preference_delivery_speed),
                       learner_preference_audio_captioning = VALUES(learner_preference_audio_captioning),
                       location  = VALUES(location),
                       mode  = VALUES(mode),
                       progress_measure  = VALUES(progress_measure),
                       score_scaled  = VALUES(score_scaled),
                       score_raw  = VALUES(score_raw),
                       score_min  = VALUES(score_min),
                       score_max  = VALUES(score_max),
                       total_time  = VALUES(total_time),
                       time_tracked  = VALUES(time_tracked),
                       runtime_success_status  = VALUES(runtime_success_status),
                       entry  = VALUES(entry);
        `;

        const params = [
            runtime.registration_activity_id,
            runtime.completion_status,
            runtime.credit,
            runtime.exit,
            runtime.learner_preference_audio_lvl,
            runtime.learner_preference_lang,
            runtime.learner_preference_delivery_speed,
            runtime.learner_preference_audio_captioning,
            runtime.location || null,
            runtime.mode,
            runtime.progress_measure,
            runtime.score_scaled,
            runtime.score_raw,
            runtime.score_min,
            runtime.score_max,
            runtime.total_time,
            runtime.time_tracked,
            runtime.runtime_success_status,
            runtime.entry
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const scormRuntime2RuntimeTransformer = (
    scormRuntime: ScormRuntime,
    registration_activity_id: number
): Runtime => {
    return {
        registration_activity_id,
        completion_status: scormRuntime.completionStatus,
        credit: scormRuntime.credit,
        entry: scormRuntime.entry,
        exit: scormRuntime.exit,
        learner_preference_audio_lvl: scormRuntime.learnerPreference.audioLevel,
        learner_preference_lang: scormRuntime.learnerPreference.language,
        learner_preference_delivery_speed: scormRuntime.learnerPreference.deliverySpeed,
        learner_preference_audio_captioning: scormRuntime.learnerPreference.audioCaptioning,
        location: scormRuntime.location,
        mode: scormRuntime.mode,
        progress_measure: scormRuntime.progressMeasure,
        score_scaled: scormRuntime.scoreScaled,
        score_raw: scormRuntime.scoreRaw,
        score_min: scormRuntime.scoreRaw,
        score_max: scormRuntime.scoreMax,
        total_time: scormRuntime.totalTime,
        time_tracked: scormRuntime.timeTracked,
        runtime_success_status: scormRuntime.runtimeSuccessStatus,
    }
}

export const processScormRuntime = async (
    scormRuntime: ScormRuntime,
    registration_activity_id: number
) => {
    await insertRuntime(scormRuntime2RuntimeTransformer(
        scormRuntime,
        registration_activity_id
    ));

    if (!scormRuntime.runtimeInteractions || scormRuntime.runtimeInteractions.length == 0) return;

    const runtimeId = await getRuntime(registration_activity_id);

    for (const interaction of scormRuntime.runtimeInteractions) {
        await processScormRuntimeInteraction(interaction, runtimeId);
    }
}