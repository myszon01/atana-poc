
import { fetchCourses, fetchRegistrations } from './scorm/service';


(async function main() {
    try {

        // fill course table & activity table
        const courses = await fetchCourses();
        for (const course of courses.courses) {
            console.log("course", course);
            console.log("children", course.rootActivity.children);
        }

        // fill registration, reg_act, user and runtime table
        const registrations = await fetchRegistrations();
        for (const registration of registrations.registrations) {
            console.log("registration", registration);
            console.log("children", registration.activityDetails.children);
        }

        console.log('Data loading process completed successfully!');
    } catch (error) {
        console.error('Error during the data loading process:', error);
    }
})();