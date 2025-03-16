import {update} from "../pool";
import {ScormRegistration} from "../../scorm/types";
import {Registration} from "../model/registration";


const insertRegistration = async (registration: Registration) => {
    try {

        const insertQuery = `
            INSERT INTO registration (id,
                                      instance,
                                      updated,
                                      course_id,
                                      learner_id)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY
                UPDATE instance   = VALUES(instance),
                       updated    = VALUES(updated),
                       course_id  = VALUES(course_id),
                       learner_id = VALUES(learner_id);
        `;

        const params = [
            registration.id,
            registration.instance,
            registration.updated,
            registration.course_id,
            registration.learner_id,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const scormRegistration2RegistrationTransformer = (scormRegistration: ScormRegistration): Registration => {
    return {
        id: scormRegistration.id,
        instance: scormRegistration.instance,
        updated: scormRegistration.updated,
        course_id: scormRegistration.course.id,
        learner_id: scormRegistration.learner.id
    }
}

export const processScormRegistration = async (scormRegistration: ScormRegistration) => {
    await insertRegistration(scormRegistration2RegistrationTransformer(scormRegistration));
}