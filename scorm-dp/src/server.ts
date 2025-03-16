import express from 'express';
import {fetchCourses, fetchRegistrations} from './scorm/service';
import {processScormActivity} from "./db/service/activity";
import {processScormCourse} from "./db/service/course";
import {processScormLearner} from "./db/service/lerner";
import {processScormRegistration} from "./db/service/registration";
import {processScormRegistrationActivity} from "./db/service/registration_activity";

const app = express();
const PORT = 3000;

app.post('/process-data', async (req, res) => {
    try {
        // fill course & activity tables
        const courses = await fetchCourses();
        for (const course of courses.courses) {
            await processScormActivity(course.rootActivity);
            await processScormCourse(course);
        }

        // fill registration, reg_act, user, and runtime tables
        const registrations = await fetchRegistrations();
        for (const registration of registrations.registrations) {
            await processScormLearner(registration.learner);
            await processScormRegistration(registration);
            await processScormRegistrationActivity(registration.activityDetails, registration.id);
        }

        console.log('Data loading process completed successfully!');
        res.status(200).send({ message: 'Data processed successfully' });
    } catch (error) {
        console.error('Error during the data loading process:', error);
        res.status(500).send({
            error: 'Error during the data loading process',
            details: error instanceof Error ? error.message : String(error),
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});