import {z} from "zod";


const course = z.object({
    id: z.string(),
    title: z.string(),
    created: z.date(),
    updated: z.date(),
    version: z.number(),
    activity_id: z.string(),
    course_learning_standard: z.string(),
    description: z.string().optional(),
})