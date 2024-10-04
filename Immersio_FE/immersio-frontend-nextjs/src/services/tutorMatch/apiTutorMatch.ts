import {
	GetLessonCompleteByClassIdRequest,
	HandleBookingRequest,
	HandleCompleteClassRequest,
	IAddCampusRequest,
	IAddClassRequest,
	IAddDrillRequest,
	IAddPlansRequest,
	IAddRoomRequest,
	IBookingClassRequest,
	IGetClassCalendarRequest,
	IGetRoomByIdRequest,
	IListTutorClassesRequest,
	IListTutorPlansRequest,
	ITutorMatchReviewDetailRequest,
	IUpdateCampusRequest,
	IUpdateClassRequest,
	IUpdateDrillRequest,
	IUpdateMaterialRequest,
	IUpdatePlansRequest,
	IUpdateRoomRequest,
	IUploadMaterialRequest,
} from '@/src/interfaces/tutorMatch/tutorMatch.interface';
import { http } from '../axiosService';
import { IGetCommonDataRequest } from '@/src/interfaces/common/common.interface';

/* ---------------------------------- PLAN ---------------------------------- */

export async function addPlan(data: IAddPlansRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan`, data);
}
export async function updatePlan(body: { id: string; data: IUpdatePlansRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/${body.id}`, body.data);
}

export async function getPlan(data: IListTutorPlansRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan`, data);
}

export async function getPlanById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/${id}`);
}

export async function uploadMaterial(body: { planId: string; data: IUploadMaterialRequest }) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/${body.planId}/material`, body.data);
}

export async function updateMaterial(body: { materialId: string; data: IUpdateMaterialRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/material/${body.materialId}`, body.data);
}

export async function deteteMaterial(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/material/${id}`);
}

export async function createPlanDrill(body: { planId: string; data: IAddDrillRequest }) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/${body.planId}/drill`, body.data);
}

export async function updatePlanDrill(body: { drillId: string; data: IUpdateDrillRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/drill/${body.drillId}`, body.data);
}

export async function detetePlanDrill(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/plan/drill/${id}`);
}

/* --------------------------------- REVIEWS -------------------------------- */

export async function getReviews(data: ITutorMatchReviewDetailRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews`, data);
}

export async function getReviewById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews/${id}`);
}

export async function createReview(planId: number, data: IUploadMaterialRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews`, data);
}

export async function updateReview(id: number, data: IUpdateMaterialRequest) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/reviews/${id}`, data);
}

export async function deteteReviewById(id: number) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tutoring/plan/material/${id}`);
}

export async function permanentDeleteReviewById(lessionId: number) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/tutoring/plan/material-drills/${lessionId}`);
}

/* --------------------------------- CAMPUS --------------------------------- */
export async function createCampus(data: IAddCampusRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses`, data);
}

export async function getCampuses(data: IGetCommonDataRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses`, data);
}

export async function createCampusRoom(data: IAddRoomRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/rooms`, data);
}

export async function getCampusRooms(data?: IGetCommonDataRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/rooms`, data);
}

export async function updateCampusRoom(data: { id: string; body: IUpdateRoomRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/room/${data.id}`, data.body);
}

export async function getCampusById(id: string) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/${id}`);
}

export async function updateCampus(data: { id: string; body: IUpdateCampusRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/${data.id}`, data.body);
}

export async function deleteCampus(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/${id}`);
}

export async function deleteCampusRooms(id: string) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/rooms/${id}`);
}

export async function getCampusRoomById(data: IGetRoomByIdRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/room/${data.id}`, {
		start: data.start,
		end: data.end,
	});
}

export async function getCampusRoomByIy(data: { id: string; start: string; end: string }) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/campuses/room/${data.id}`, {
		start: data.start,
		end: data.end,
	});
}

/* ---------------------------------- CLASS --------------------------------- */
export async function addClass(data: IAddClassRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking`, data);
}

export async function getClasses(data?: IListTutorClassesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/classes`, data);
}

export async function updateClass(data: { id: number; body: IUpdateClassRequest }) {
	return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/class/${data.id}`, data.body);
}

export async function deleteClass(id: number) {
	return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/class/${id}`);
}

export async function getClassById(id: number) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/class/${id}`);
}

export async function bookingClass(data: IBookingClassRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/class/booking`, data);
}

export async function getTutorInfo() {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/tutors`);
}

export async function getClassByTutor(id: number) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/tutors/${id}/classes`);
}

export async function getCalendarClass(data: IGetClassCalendarRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/calendar/student`, data);
}
export async function acceptBookingRequest(data: HandleBookingRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/booking/accept`, data);
}
export async function rejectBookingRequest(data: HandleBookingRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/booking/reject`, data);
}

export async function getLessonCompleteByClassId(params: GetLessonCompleteByClassIdRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/lesson/complete/${params.classId}`);
}

export async function handleCompleteClass(data: HandleCompleteClassRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/class-booking/lesson/complete`, data);
}
