//const BACKEND_API = 'http://147.139.30.244/jntua';

//export default BACKEND_API;
//const prefix = 'http://127.0.0.1:8000/'
const prefix = 'https://apiv2.plasmatch.in/'
export default {
    students: `${prefix}jntua/students/`,
    subjects: `${prefix}jntua/subjects/`,
    results: `${prefix}jntua/results/`,
    semestergpa: `${prefix}jntua/semestergpa/`,
    feedbacks: `${prefix}jntua/feedbacks/`
}