import {update} from "../pool";
import {Course} from "../model/course";
import {ScormCourse} from "../../scorm/types";


const insertCourse = async (course: Course) => {
    try {

        const insertQuery = `
            INSERT INTO course (id,
                                title,
                                created,
                                updated,
                                version,
                                activity_id,
                                course_learning_standard,
                                description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY
                UPDATE title                    = VALUES(title),
                       created                  = VALUES(created),
                       updated                  = VALUES(updated),
                       version                  = VALUES(version),
                       course_learning_standard = VALUES(course_learning_standard),
                       description              = VALUES(description);

        `;

        const params = [
            course.id,
            course.title,
            course.created,
            course.updated,
            course.version,
            course.activity_id,
            course.course_learning_standard,
            course.description || null,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const scornCourse2CourseTransformer = (scormCourse: ScormCourse): Course => {
    return {
        id: scormCourse.id,
        title: scormCourse.title,
        created: scormCourse.created,
        updated: scormCourse.updated,
        version: scormCourse.version,
        activity_id: scormCourse.activityId,
        course_learning_standard: scormCourse.courseLearningStandard,
        description: scormCourse.metadata?.description
    }
}

export const processScormCourse = async (scormCourse: ScormCourse) => {
    await insertCourse(scornCourse2CourseTransformer(scormCourse));
}