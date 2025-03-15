import {z} from "zod";

const runtime = z.object({
    id: z.string(),
    completion_status: z.string(),
    credit: z.string(),
    entry: z.string(),
    exit: z.string(),
    learner_preference_audio_lvl: z.number(),
    learner_preference_lang: z.string(),
    learner_preference_delivery_speed: z.number(),
    learner_preference_audio_captioning: z.number(),
    location: z.string(),
    mode: z.string(),
    progress_measure: z.string(),
    score_scaled: z.string(),
    score_raw: z.string(),
    score_min: z.string(),
    score_max: z.string(),
    total_time: z.string(),
    time_tracked: z.string(),
    runtime_success_status: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
})