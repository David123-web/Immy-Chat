import { IAddBlogCategoryForm, IAddBlogForm, IAddBlogRequest, IGetBlogCategoriesRequest, IGetBlogRequest, IUpdateBlogCategoryRequest, IUpdateBlogRequest } from '@/src/interfaces/blogManagement/blogManagement.interface';
import { http } from '../axiosService';

/* ------------------------------ BLOG CATEROGY ----------------------------- */
export async function createBlogCategory(body: IAddBlogCategoryForm) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories`, body);
}

export async function getBlogCategories(data: IGetBlogCategoriesRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories`, data);
}

export async function getBlogCategoryById(id: string) {
  return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories/${id}`);
}

export async function updateBlogCategoryById(data:{id: string, body: IUpdateBlogCategoryRequest}) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories/${data.id}`, data.body);
}

export async function deleteBlogCategoryById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories/${id}`);
}

export async function restoreBlogCategoryById(id: string) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories/${id}/restore`);
}

export async function deletePermanentlyBlogCategoryById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/categories/${id}/permanent`);
}

/* ---------------------------------- BLOG ---------------------------------- */
export async function createBlog(body: IAddBlogRequest) {
	return await http.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs`, body);
}

export async function getBlog(data: IGetBlogRequest) {
	return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs`, data);
}

export async function getBlogById(id: string) {
  return await http.get(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/${id}`);
}

export async function updateBlogById(data:{id: string, body: IUpdateBlogRequest}) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/${data.id}`, data.body);
}

export async function deleteBlogById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/${id}`);
}

export async function restoreBlogById(id: string) {
  return await http.patch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/${id}/restore`);
}

export async function deletePermanentlyBlogById(id: string) {
  return await http.delete(`${process.env.NEXT_PUBLIC_BASE_API_URL}/blogs/${id}/permanent`);
}
