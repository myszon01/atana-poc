import {z} from "zod";


export const activitySchema = z.object({
    id: z.string(),
    resource_identifier: z.string(),
    activity_type: z.enum(["UNKNOWN", "AGGREGATION", "SCO", "ASSET", "OBJECTIVE"]), // Update valid activity types as needed
    href: z.string(),
    scaled_passing_score: z.string().optional(),
    title: z.string(),
    parent_id: z.string().optional(),
})

export type Activity = z.infer<typeof activitySchema>;


/*
To traverse the tree and return all relevant data

WITH ParentAndChildren AS (
    -- Get the specified parent by ID
    SELECT *
    FROM activity
    WHERE id = 'course_1' -- Replace 'PARENT_ID' with the actual parent ID you want to query

    UNION ALL

    -- Get the direct children of the specified parent
    SELECT *
    FROM activity
    WHERE parent_id = 'course_1' -- Replace 'PARENT_ID' with the actual parent ID you want to query
)

-- Final result
SELECT *
FROM ParentAndChildren
ORDER BY id;


* */