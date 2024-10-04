import { http } from "../axiosService";

export async function getDialogs(body) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialogs`,
    body
  );
}

export async function postDialog(body) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialogs`,
    body
  );
}

export async function getDialog(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialogs/${id}`
  );
}

export async function updateDialog(body) {
  return await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialogs/${body.id}`,
    { ...body, id: undefined }
  );
}

export async function deleteDialog(id) {
  return await http.delete(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialogs/${id}`
  );
}

export async function getDialogsByLessonID(body) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines`,
    body
  );
}

export async function postDialogByLessonID(body) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines`,
    body
  );
}

export async function getDialogByLessonID(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${id}`
  );
}

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

export async function getDialogAIDataByLessonID(id) {
  return await http.get(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${id}/ai-data`
  );
}

export async function postDialogAIDataByLessonID(body) {
  return await http.post(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${body.id}/ai-data`,
    { ...body, id: undefined }
  );
}

export async function updateDialogAIDataByLessonID(body) {
  return await http.patch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${body.id}/ai-data`,
    { ...body, id: undefined }
  );
}

export async function deleteDialogAIDataByLessonID(id) {
  return await http.delete(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}/dialog-lines/${id}/ai-data`
  );
}

export async function getVoiceList(LanguageCode) {
    return await http.get(
        `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/service/aws-polly/get-voiceList/${LanguageCode}`
    );
}

export async function getVoiceLanList() {
    return await http.get(
        `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/service/aws-polly/get-language`
    );
}

export async function getAIVoice(code, name, engine, sentence) {
    return await http.post(
        `${process.env.NEXT_PUBLIC_EXTERNAL_API_URL}/service/aws-polly/generate-audio`,
        {code, name, engine, sentence}
    );
}