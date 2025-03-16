import {z} from "zod";

const registration_activity = z.object({
    id: z.string().optional(),
    registration_id: z.string(),
    activity_id: z.string(),

    attempts: z.number(),
    activity_completion: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE"]),
    activity_success: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    score_scaled: z.number(),
    time_tracked: z.string(),
    completion_amount_scaled: z.number(),
    suspended: z.boolean(),

    static_completion_threshold: z.string(),
    static_launch_data: z.string(),
    static_max_time_allowed: z.string(),
    static_scaled_passing_score: z.number(),
    static_scaled_passing_score_used: z.boolean(),
    static_time_limit_action: z.string(),
})

export type RegistrationActivity = z.infer<typeof registration_activity>;