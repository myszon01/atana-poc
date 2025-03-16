import {z} from "zod";

const runtime_interaction = z.object({
    id: z.string(),
    runtime_id: z.number(),
    type: z.enum(["TrueFalse", "Choice", "FillIn", "LongFillIn", "Matching", "Performance", "Sequencing", "Likert", "Numeric", "Other"]),
    objectives: z.string(),
    timestamp: z.date().optional(),
    timestamp_utc: z.date().optional(),
    correct_responses: z.string(),
    weighting: z.string(),
    learner_response: z.string(),
    result: z.string(),
    latency: z.string(),
    description: z.string().optional(),
})

export type RuntimeInteraction = z.infer<typeof runtime_interaction>;