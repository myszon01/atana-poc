import { z } from "zod";

const dateSchema = z.string().transform((val) => {
    const parsedDate = new Date(val);
    return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
});


export const scornActivitySchema = z.object({
    externalIdentifier: z.string(),
    itemIdentifier: z.string(),
    resourceIdentifier: z.string(),
    activityType: z.enum(["UNKNOWN", "AGGREGATION", "SCO", "ASSET", "OBJECTIVE"]),
    href: z.string(),
    scaledPassingScore: z.string().optional(),
    title: z.string(),
    children: z.array(z.lazy(():any => scornActivitySchema)).optional(),
});
export type ScormActivity = z.infer<typeof scornActivitySchema>;


const scormCourseSchema = z.object({
    id: z.string(),
    title: z.string(),
    created: z.date(),
    updated: z.date(),
    version: z.number(),
    activityId: z.string(),
    courseLearningStandard: z.string(),
    rootActivity: scornActivitySchema,
    metadata: z.object({
        description: z.string().optional(),
    }).optional(),
});
export type ScormCourse = z.infer<typeof scormCourseSchema>;
// Define the schema for the response
export const scormCourseSchemaResponse = z.object({
    courses: z.array(scormCourseSchema),
    more: z.string().optional()
});
// export type Course = z.infer<typeof scormCourseSchema>;
export type ScormCourseResponse = z.infer<typeof scormCourseSchemaResponse>;





const commentsSchema = z.object({
    value: z.string(),
    location: z.string(),
    dateTime: z.string(),
});

const scormRuntimeInteractionsSchema = z.object({
    id: z.string(),
    type: z.enum(["TrueFalse", "Choice", "FillIn", "LongFillIn", "Matching", "Performance", "Sequencing", "Likert", "Numeric", "Other"]),
    objectives: z.array(z.string()),
    timestamp: dateSchema.optional(),
    timestampUtc: dateSchema.optional(),
    correctResponses: z.array(z.string()),
    weighting: z.string(),
    learnerResponse: z.string(),
    result: z.string(),
    latency: z.string(),
    description: z.string().optional(),
});
export type ScormRuntimeInteraction = z.infer<typeof scormRuntimeInteractionsSchema>;

const runtimeObjectivesSchema = z.object({
    id: z.string(),
    scoreScaled: z.string(),
    scoreMin: z.string(),
    scoreMax: z.string(),
    scoreRaw: z.string(),
    runtimeObjectiveSuccessStatus: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    runtimeObjectiveCompletionStatus: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE", "NOT_ATTEMPTED", "BROWSED"]),
    progressMeasure: z.string(),
    description: z.string(),
});

const scormRuntimeSchema = z.object({
    completionStatus: z.string(),
    credit: z.string(),
    entry: z.string(),
    exit: z.string(),
    learnerPreference: z.object({
        audioLevel: z.number(),
        language: z.string(),
        deliverySpeed: z.number(),
        audioCaptioning: z.number(),
    }),
    location: z.string().optional(),
    mode: z.string(),
    progressMeasure: z.string(),
    scoreScaled: z.string(),
    scoreRaw: z.string(),
    scoreMin: z.string(),
    scoreMax: z.string(),
    totalTime: z.string(),
    timeTracked: z.string(),
    runtimeSuccessStatus: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    suspendData: z.string(),
    learnerComments: z.array(commentsSchema),
    lmsComments: z.array(commentsSchema),
    runtimeInteractions: z.array(scormRuntimeInteractionsSchema).optional(),
    runtimeObjectives: z.array(runtimeObjectivesSchema).optional(),
});
export type ScormRuntime = z.infer<typeof scormRuntimeSchema>;




const scormRegistrationActivityDetailsSchema = z.object({
    id: z.string(),
    title: z.string(),
    attempts: z.number(),
    activityCompletion: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE"]),
    activitySuccess: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    score: z.object({ scaled: z.number() }).default({scaled: 0}),
    timeTracked: z.string(),
    completionAmount: z.object({ scaled: z.number() }),
    suspended: z.boolean(),
    children: z.array(z.lazy((): any => scormRegistrationActivityDetailsSchema)),
    staticProperties: z.object({
        completionThreshold: z.string(),
        launchData: z.string(),
        maxTimeAllowed: z.string(),
        scaledPassingScore: z.number(),
        scaledPassingScoreUsed: z.boolean(),
        timeLimitAction: z.string(),
    }),
    runtime: scormRuntimeSchema.optional(),
});
export type ScormRegistrationActivityDetails = z.infer<typeof scormRegistrationActivityDetailsSchema>;

const scormLernerSchema = z.object({
    id: z.string(),
    email: z.string().optional(),
    firstName: z.string(),
    lastName: z.string(),
})
export type ScormLearner = z.infer<typeof scormLernerSchema>;

const sormRegistrationSchema = z.object({
    id: z.string(),
    instance: z.number(),
    updated: z.date(),
    registrationCompletion: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE"]),
    registrationCompletionAmount: z.number(),
    registrationSuccess: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    score: z.object({ scaled: z.number() }).default({ scaled: 0}),
    totalSecondsTracked: z.number(),
    firstAccessDate: z.date(),
    lastAccessDate: z.date(),
    completedDate: z.date(),
    createdDate: z.date(),
    course: z.object({
        id: z.string(),
        title: z.string(),
        version: z.number(),
    }),
    learner: scormLernerSchema,
    tags: z.array(z.string()),
    activityDetails: scormRegistrationActivityDetailsSchema,
});

export const scormRegistrationsSchemaResponse = z.object({
    registrations: z.array(sormRegistrationSchema),
    more: z.string().optional(),
});
export type ScormRegistration = z.infer<typeof sormRegistrationSchema>;
export type ScormRegistrationResponse = z.infer<typeof scormRegistrationsSchemaResponse>;




