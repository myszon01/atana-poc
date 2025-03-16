import {Activity} from "../model/activity";
import {update} from "../pool";
import {ScormActivity} from "../../scorm/types";


const insertActivity = async (activity: Activity) => {
    try {

        const insertQuery = `
            INSERT INTO activity (id,
                                  resource_identifier,
                                  activity_type,
                                  href,
                                  scaled_passing_score,
                                  title,
                                  parent_id)
            VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY
            UPDATE
                resource_identifier =
            VALUES (resource_identifier), activity_type =
            VALUES (activity_type), href =
            VALUES (href), scaled_passing_score =
            VALUES (scaled_passing_score), title =
            VALUES (title), parent_id =
            VALUES (parent_id);

        `;

        const params = [
            activity.id,
            activity.resource_identifier,
            activity.activity_type,
            activity.href,
            activity.scaled_passing_score || null,
            activity.title,
            activity.parent_id || null,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }

}


const scornActivity2ActivityTransformer = (scornActivity: ScormActivity, parentId?: string): Activity => {
    return {
        id: scornActivity.itemIdentifier,
        resource_identifier: scornActivity.resourceIdentifier,
        activity_type: scornActivity.activityType,
        href: scornActivity.href,
        parent_id: parentId,
        title: scornActivity.title,
        scaled_passing_score: scornActivity.scaledPassingScore,
    }
}

export const processScormActivity = async (rootActivity: ScormActivity) => {
    type Node = {
        parentId: string | undefined,
        activity: ScormActivity,
    }

    const queue = [{
        parentId: undefined,
        activity: rootActivity,
    } as Node];

    while (queue.length > 0) {
        const node = queue.shift()!;

        await insertActivity(scornActivity2ActivityTransformer(node.activity, node.parentId))

        node.activity.children?.forEach(child => {
            queue.push({parentId: node.activity.itemIdentifier, activity: child});
        })
    }
}