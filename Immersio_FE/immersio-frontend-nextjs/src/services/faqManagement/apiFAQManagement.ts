import { IAddBlogCategoryForm, IAddBlogForm, IAddBlogRequest, IGetBlogCategoriesRequest, IGetBlogRequest, IUpdateBlogCategoryRequest, IUpdateBlogRequest } from '@/src/interfaces/blogManagement/blogManagement.interface';
import { http } from '../axiosService';
import { IAddFAQCategoryForm, IAddFAQRequest, IGetFAQCategoriesRequest, IGetFAQRequest, IUpdateFAQCategoryRequest, IUpdateFAQRequest } from '@/src/interfaces/faqManagement/faqManagement.interface';

/* ------------------------------ FAQ CATEROGY ------------------------------ */
export async function createFAQCategory(body: IAddFAQCategoryForm) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories`, body);
}

export async function getFAQCategories(data: IGetFAQCategoriesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories`, data);
}

export async function getFAQCategoryById(id: string) {
  return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories/${id}`);
}

export async function updateFAQCategoryById(data:{id: string, body: IUpdateFAQCategoryRequest}) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories/${data.id}`, data.body);
}

export async function deleteFAQCategoryById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories/${id}`);
}

export async function restoreFAQCategoryById(id: string) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories/${id}/restore`);
}

export async function deletePermanentlyFAQCategoryById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/categories/${id}/permanent`);
}

/* ----------------------------------- FAQ ---------------------------------- */
export async function createFAQ(body: IAddFAQRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs`, body);
}

export async function getFAQ(data: IGetFAQRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs`, data);
}

export async function getFAQById(id: string) {
  return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/${id}`);
}

export async function updateFAQById(data:{id: string, body: IUpdateFAQRequest}) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/${data.id}`, data.body);
}

export async function deleteFAQById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/${id}`);
}

export async function restoreFAQById(id: string) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/${id}/restore`);
}

export async function deletePermanentlyFAQById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/faqs/${id}/permanent`);
}
