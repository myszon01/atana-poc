import {z} from "zod";


const activity = z.object({
    id: z.string(),
    resource_identifier: z.string(),
    activity_type: z.enum(["UNKNOWN", "AGGREGATION", "SCO", "ASSET", "OBJECTIVE"]), // Update valid activity types as needed
    href: z.string(),
    scaled_passing_score: z.string().optional(),
    title: z.string(),
    parent_id: z.string().optional(),
})