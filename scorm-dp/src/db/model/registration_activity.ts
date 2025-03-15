import {z} from "zod";

const registration_activity = z.object({
    id: z.string(),
    registration_id: z.string(),
    activity_id: z.string(),
    runtime_id: z.string(),
    parent_id: z.string().optional(),

    attempts: z.number(),
    activityCompletion: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE"]),
    activitySuccess: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    score: z.object({ scaled: z.number() }).default({scaled: 0}),
    timeTracked: z.string(),
    completionAmount: z.object({ scaled: z.number() }),
    suspended: z.boolean(),

    static_completion_threshold: z.string(),
    static_launch_data: z.string(),
    static_max_time_allowed: z.string(),
    static_scaled_passing_score: z.number(),
    static_scaled_passing_score_used: z.boolean(),
    static_time_limit_action: z.string(),
})