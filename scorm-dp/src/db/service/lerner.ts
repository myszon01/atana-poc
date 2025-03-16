import {update} from "../pool";
import {Learner} from "../model/lerner";
import {ScormLearner} from "../../scorm/types";


const insertLearner = async (learner: Learner) => {
    try {

        const insertQuery = `
            INSERT INTO learner (id,
                                 email,
                                 first_name,
                                 last_name)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY
                UPDATE email      = VALUES(email),
                       first_name = VALUES(first_name),
                       last_name  = VALUES(last_name);
        `;

        const params = [
            learner.id,
            learner.email || null,
            learner.first_name,
            learner.first_name,
        ];

        await update(insertQuery, params);
    } catch (error) {
        console.error("Error inserting activity:", error);
        throw error;
    }
}

const scornLearner2LearnerTransformer = (scornLearner: ScormLearner): Learner => {
    return {
        id: scornLearner.id,
        email: scornLearner.email,
        first_name: scornLearner.firstName,
        last_name: scornLearner.lastName,
    }
}

export const processScormLearner = async (scornLearner: ScormLearner) => {
    await insertLearner(scornLearner2LearnerTransformer(scornLearner));
}