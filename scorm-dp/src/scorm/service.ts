import { scormCourseApi, scormRegistrationApi } from './client';
import {
    ScormCourseResponse,
    scormCourseSchemaResponse,
    ScormRegistrationResponse,
    scormRegistrationsSchemaResponse
} from "./types";
import {ZodError} from "zod";


export async function fetchCourses(more?: string): Promise<ScormCourseResponse> {
    try {
        return await new Promise((resolve, reject) => {
            scormCourseApi.getCourses({
                includeCourseMetadata: true,
                more
            }, (error: any, data: any) => {
                if (error) {
                    reject(new Error(`Error fetching courses: ${error.message}`));
                    return;
                }

                try {
                    resolve(scormCourseSchemaResponse.parse({
                        courses: data.courses,
                        more: data.more,
                    }));
                } catch (validationError) {
                    const msg = validationError instanceof ZodError ? validationError.message : validationError;
                    reject(new Error(`Validation error: ${msg}`));
                }
            });
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}


export async function fetchRegistrations(courseId?: string, more?: string): Promise<ScormRegistrationResponse> {
    try {
        return await new Promise((resolve, reject) => {
            scormRegistrationApi.getRegistrations({
                includeRuntime: true,
                includeChildResults: true,
                includeInteractionsAndObjectives: true,
                courseId,
                more
            }, (error: any, data: any) => {
                if (error) {
                    reject(new Error(`Error fetching courses: ${error.message}`));
                    return;
                }

                try {
                    resolve(scormRegistrationsSchemaResponse.parse({
                        registrations: data.registrations,
                        more: data.more,
                    }));
                } catch (validationError) {
                    const msg = validationError instanceof ZodError ? validationError.message : validationError;
                    reject(new Error(`Validation error: ${msg}`));
                }
            });
        });
    } catch (error) {
        console.error('Error fetching registrations:', error);
        throw error;
    }
}
