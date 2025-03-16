import {z} from "zod";

const learner = z.object({
    id: z.string(),
    email: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
})

export type Learner = z.infer<typeof learner>;