import {queryWithValidation, update} from "../pool";
import {ScormRegistrationActivityDetails} from "../../scorm/types";
import {RegistrationActivity} from "../model/registration_activity";
import {z} from "zod";
import {processScormRuntime} from "./runtime";

const getRegistrationActivity = async (
    registration_id: string,
    activity_id: string
) => {
    try {

        const query = `
            SELECT ID FROM registration_activity WHERE registration_id = ? AND activity_id = ?;
        `
        const params = [registration_id, activity_id];

        const res = await queryWithValidation(query, params, z.object({
            ID: z.number()
        }));
        return res[0].ID;

    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const insertRegistrationActivity = async (
    registrationActivity: RegistrationActivity
) => {
    try {

        const insertQuery = `
            INSERT INTO registration_activity (registration_id,
                                               activity_id,
                                               attempts,
                                               activity_completion,
                                               activity_success,
                                               score_scaled,
                                               time_tracked,
                                               completion_amount_scaled,
                                               suspended,
                                               static_completion_threshold,
                                               static_launch_data,
                                               static_max_time_allowed,
                                               static_scaled_passing_score,
                                               static_scaled_passing_score_used,
                                               static_time_limit_action)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?) 
            ON DUPLICATE KEY
                UPDATE
                    attempts = VALUES (attempts),
                    activity_completion = VALUES (activity_completion),
                    activity_success = VALUES (activity_success),
                    score_scaled = VALUES (score_scaled),
                    time_tracked = VALUES (time_tracked),
                    completion_amount_scaled = VALUES (completion_amount_scaled),
                    suspended = VALUES (suspended),
                    static_completion_threshold = VALUES (static_completion_threshold),
                    static_launch_data = VALUES (static_launch_data),
                    static_max_time_allowed = VALUES (static_max_time_allowed),
                    static_scaled_passing_score = VALUES (static_scaled_passing_score),
                    static_scaled_passing_score_used = VALUES (static_scaled_passing_score_used),
                    static_time_limit_action = VALUES (static_time_limit_action);

        `;

        const params = [
            registrationActivity.registration_id,
            registrationActivity.activity_id,
            registrationActivity.attempts,
            registrationActivity.activity_completion,
            registrationActivity.activity_success,
            registrationActivity.score_scaled,
            registrationActivity.time_tracked,
            registrationActivity.completion_amount_scaled,
            registrationActivity.suspended,
            registrationActivity.static_completion_threshold,
            registrationActivity.static_launch_data,
            registrationActivity.static_max_time_allowed,
            registrationActivity.static_scaled_passing_score,
            registrationActivity.static_scaled_passing_score_used,
            registrationActivity.static_time_limit_action,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }

}


const scormRegistrationActivity2registrationActivityTransformer = (
    scormRegistrationActivity: ScormRegistrationActivityDetails,
    registration_id: string,
): RegistrationActivity => {

    return {
        registration_id: registration_id,
        activity_id: scormRegistrationActivity.id,

        attempts: scormRegistrationActivity.attempts,
        activity_completion: scormRegistrationActivity.activityCompletion,
        activity_success: scormRegistrationActivity.activitySuccess,
        score_scaled: scormRegistrationActivity.score.scaled,
        time_tracked: scormRegistrationActivity.timeTracked,
        completion_amount_scaled: scormRegistrationActivity.completionAmount.scaled,
        suspended: scormRegistrationActivity.suspended,
        static_completion_threshold: scormRegistrationActivity.staticProperties.completionThreshold,
        static_launch_data: scormRegistrationActivity.staticProperties.launchData,
        static_max_time_allowed: scormRegistrationActivity.staticProperties.maxTimeAllowed,
        static_scaled_passing_score: scormRegistrationActivity.staticProperties.scaledPassingScore,
        static_scaled_passing_score_used: scormRegistrationActivity.staticProperties.scaledPassingScoreUsed,
        static_time_limit_action: scormRegistrationActivity.staticProperties.timeLimitAction
    };
}

export const processScormRegistrationActivity = async (
    rootActivity: ScormRegistrationActivityDetails,
    registration_id: string,
    ) => {
    type Node = {
        parentId: string | undefined,
        activity: ScormRegistrationActivityDetails,
    }

    const queue = [{
        parentId: undefined,
        activity: rootActivity,
    } as Node];

    while (queue.length > 0) {
        const node = queue.shift()!;



        await insertRegistrationActivity(scormRegistrationActivity2registrationActivityTransformer(
            node.activity,
            registration_id,
        ))

        // process runtime
        if (node.activity.runtime) {

            const registrationActivityId = await getRegistrationActivity(registration_id, node.activity.id)
            await processScormRuntime(node.activity.runtime, registrationActivityId);
        }

        node.activity.children?.forEach(child => {
            queue.push({parentId: node.activity.id, activity: child});
        })
    }
}