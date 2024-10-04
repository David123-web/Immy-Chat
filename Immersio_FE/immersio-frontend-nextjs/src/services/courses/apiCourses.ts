import {
	IAcceptRejectNotificationRequest,
	IDeleteCoInstructorRequest as IRemoveCoInstructorRequest,
	IGetListPaidCoursesRequest,
	ImportStep1Request,
	ImportStep2Request,
} from './../../interfaces/course/course.interface';
import { addSubdomainIdHeader } from './../../helpers/auth';
import { http } from '../axiosService';

export async function getAllCourses(data?: any) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses`, data, addSubdomainIdHeader());
}

export async function getPermissionCoursesPublic(courseID) {
	return await http.get(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${courseID}/permission`,
		null,
		addSubdomainIdHeader()
	);
}

export async function getAllCoursesPublish(data) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/publish`, data, addSubdomainIdHeader());
}

export async function validateCourse(id) {
	return await http.get(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-validation/${id}`,
		null,
		addSubdomainIdHeader()
	);
}

export async function postCourses(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses`, data);
}

export async function updateCourse(body) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${body.id}`, { ...body, id: undefined });
}

export async function deleteCourse(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}`);
}

export async function recycleCourse(id) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}/recycle`);
}

export async function softDeleteCourse(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}/permanent`);
}

export async function postCoursesLessonDialogue(data) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses`, data);
}

export async function getCourseLanguages() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-languages`, null, addSubdomainIdHeader());
}

export async function getLanguagesHasCourse() {
	return await http.get(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-languages/languagesHasCourse`,
		null,
		addSubdomainIdHeader()
	);
}

export async function getCourseLevels() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/levels`, null, addSubdomainIdHeader());
}

export async function getCourseType() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-type`);
}

export async function getCourseTags() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tags`, null, addSubdomainIdHeader());
}

export async function createCourseTags(body) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tags`, body);
}

export async function updateCourseTags(id, body) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tags/${id}`, body);
}

export async function deleteCourseTags(id) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tags/${id}`);
}

export async function getCourseByID(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}`, null, addSubdomainIdHeader());
}

export async function getCourseTypes() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/course-types`, null, addSubdomainIdHeader());
}

export async function getCourseByIDPublic(id) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/${id}/public`, null, addSubdomainIdHeader());
}

export async function assignToCourse(body) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-student/`, body, addSubdomainIdHeader());
}

export async function getTrackingCourseID(body) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-tracking/${body.courseId}`, null);
}

export async function getTrackingCourseAndLessonID(body) {
	return await http.get(
		`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-tracking/${body.courseId}/lessons/${body.lessonId}`,
		null
	);
}

export async function updateTrackingCourseByID(body) {
	return await http.put(`${process.env.NEXT_PUBLIC_BASE_API_URL}/course-tracking/complete`, body);
}

export async function postInviteCoInstructor(body) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/co-instructor/invite`, body);
}

export async function acceptInviteCoInstructor(body: IAcceptRejectNotificationRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/co-instructor/accept/${body.token}`);
}

export async function rejectInviteCoInstructor(body: IAcceptRejectNotificationRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/co-instructor/reject/${body.token}`);
}

export async function removeCoInstructor(body: IRemoveCoInstructorRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/co-instructor/remove`, body);
}

export async function importCourseStep1(body: ImportStep1Request) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/import/step-1`, body.file);
}

export async function importCourseStep2(body: ImportStep2Request) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/import/step-2`, body.data);
}

export async function getListPaidCourses(body: IGetListPaidCoursesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/courses/paid`, body);
}
