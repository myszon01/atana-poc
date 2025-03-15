import {z} from "zod";

const lerner = z.object({
    id: z.string(),
    email: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
})