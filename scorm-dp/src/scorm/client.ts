// @ts-ignore
import ScormCloud from '@rusticisoftware/scormcloud-api-v2-client-javascript';

const APP_ID = process.env.SCORM_APP_ID;
const SECRET_KEY = process.env.SCORM_SECRET_KEY;


if (!APP_ID || !SECRET_KEY) {
    throw new Error('SCORM credentials (SCORM_APP_ID and SCORM_SECRET_KEY) are missing in .env');
}

const APP_NORMAL = ScormCloud.ApiClient.instance.authentications['APP_NORMAL'];
APP_NORMAL.username = APP_ID;
APP_NORMAL.password = SECRET_KEY;


export const scormCourseApi = new ScormCloud.CourseApi();
export const scormRegistrationApi = new ScormCloud.RegistrationApi();
