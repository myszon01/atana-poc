import { z } from "zod";


const rootActivitySchema = z.object({
    externalIdentifier: z.string(),
    itemIdentifier: z.string(),
    resourceIdentifier: z.string(),
    activityType: z.enum(["UNKNOWN", "AGGREGATION", "SCO", "ASSET", "OBJECTIVE"]), // Update valid activity types as needed
    href: z.string(),
    scaledPassingScore: z.string().optional(),
    title: z.string(),
    children: z.array(z.lazy(():any => rootActivitySchema)).optional(), // Allows an array where `null` values are permitted
});


// Define the schema for a single "course"
const courseSchema = z.object({
    id: z.string(), // Unique course ID
    title: z.string(), // Title of the course
    created: z.date(), // Date string for creation time
    updated: z.date(), // Date string for update time
    version: z.number(), // Version number of the course
    activityId: z.string(), // Identifier for the activity
    courseLearningStandard: z.string(), // Learning standard (e.g., SCORM12)
    rootActivity: rootActivitySchema,
    metadata: z.object({
        description: z.string().optional(),
    }).optional(),
});
// Define the schema for the response
export const courseSchemaResponse = z.object({
    courses: z.array(courseSchema),
    more: z.string().optional()
});
// export type Course = z.infer<typeof courseSchema>;
export type CourseResponse = z.infer<typeof courseSchemaResponse>;





const commentsSchema = z.object({
    value: z.string(),
    location: z.string(),
    dateTime: z.string(),
});

const runtimeInteractionsSchema = z.object({
    id: z.string(),
    type: z.enum(["TrueFalse", "Choice", "FillIn", "LongFillIn", "Matching", "Performance", "Sequencing", "Likert", "Numeric", "Other"]),
    objectives: z.array(z.string()),
    timestamp: z.string(),
    timestampUtc: z.string(),
    correctResponses: z.array(z.string()),
    weighting: z.string(),
    learnerResponse: z.string(),
    result: z.string(),
    latency: z.string(),
    description: z.string(),
});

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

const runtimeSchema = z.object({
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
    runtimeInteractions: z.array(runtimeInteractionsSchema).optional(),
    runtimeObjectives: z.array(runtimeObjectivesSchema).optional(),
});




const activityDetailsSchema = z.object({
    id: z.string(),
    title: z.string(),
    attempts: z.number(),
    activityCompletion: z.enum(["UNKNOWN", "COMPLETED", "INCOMPLETE"]),
    activitySuccess: z.enum(["UNKNOWN", "PASSED", "FAILED"]),
    score: z.object({ scaled: z.number() }).default({scaled: 0}),
    timeTracked: z.string(),
    completionAmount: z.object({ scaled: z.number() }),
    suspended: z.boolean(),
    children: z.array(z.lazy((): any => activityDetailsSchema)),
    staticProperties: z.object({
        completionThreshold: z.string(),
        launchData: z.string(),
        maxTimeAllowed: z.string(),
        scaledPassingScore: z.number(),
        scaledPassingScoreUsed: z.boolean(),
        timeLimitAction: z.string(),
    }),
    runtime: runtimeSchema.optional(),
});


const registrationSchema = z.object({
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
    learner: z.object({
        id: z.string(),
        email: z.string().optional(),
        firstName: z.string(),
        lastName: z.string(),
    }),
    tags: z.array(z.string()),
    activityDetails: activityDetailsSchema,
});

export const registrationsSchemaResponse = z.object({
    registrations: z.array(registrationSchema),
    more: z.string().optional(),
});
export type Registration = z.infer<typeof registrationSchema>;
export type RegistrationResponse = z.infer<typeof registrationsSchemaResponse>;




