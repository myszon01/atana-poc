import {z} from "zod";

const registration = z.object({
    id: z.string(),
    instance: z.number(),
    updated: z.date(),
    course_id: z.string(),
    learner_id: z.string(),
})

export type Registration = z.infer<typeof registration>;