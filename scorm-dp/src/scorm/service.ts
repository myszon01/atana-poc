import { scormCourseApi, scormRegistrationApi } from './client';
import {
    CourseResponse,
    courseSchemaResponse,
    RegistrationResponse,
    registrationsSchemaResponse
} from "./types";
import {ZodError} from "zod";


export async function fetchCourses(more?: string): Promise<CourseResponse> {
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
                    resolve(courseSchemaResponse.parse({
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


export async function fetchRegistrations(courseId?: string, more?: string): Promise<RegistrationResponse> {
    try {
        return await new Promise((resolve, reject) => {
            scormRegistrationApi.getRegistrations({
                includeRuntime: true,
                includeChildResults: true,
                courseId,
                more
            }, (error: any, data: any) => {
                if (error) {
                    reject(new Error(`Error fetching courses: ${error.message}`));
                    return;
                }

                try {
                    resolve(registrationsSchemaResponse.parse({
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
        console.error('Error fetching courses:', error);
        throw error;
    }
}
