import { http } from "../axiosService";

export async function updateDialogByLessonID(body) {
  return await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${body.id}`,
    { ...body, id: undefined }
  );
}

export async function deleteDialogByLessonID(id) {
  return await http.delete(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${id}`
  );
}

export async function getVoiceList(LanguageCode) {
    return await http.get(
        `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/service/aws-polly/get-voiceList/${LanguageCode}`
    );
}

export async function getAIVoice(code, name, engine, sentence) {
    return await http.post(
        `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/service/aws-polly/generate-audio`,
        {code, name, engine, sentence}
    );
}

export async function postLessonRolePlay(lessonId, isRolePlaying) {
    return await http.post(
        `${process.env.NEXT_PUBLIC_IMMY_CHAT_URL}/service/role-play/post-lesson`,
        {lessonId: lessonId, isRolePlaying: isRolePlaying}
   );
}






