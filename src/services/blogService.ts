import { useQuery } from "@tanstack/react-query";
import HttpService from "./httpService";
import { BlogList } from "@/types/blog";

export type BlogParams = {
    page: number;
    limit: number;
    type: string;
}
type Respone = {
    data: BlogList;
    pages: number;
    totalCount: number;
    page: number;
    count: number;
}

export interface BlogNewsResponse {
  _id: string;
  name: string;
  description: string;
  date: string;
  type: string;
  link: string;
  updatedAt: string;
  image: string;
  sortorder: number;
  slug: string;
}
export interface BannerResponse {
  _id: string;
  image: string;
  type: string;
  position: string;
  sortOrder: string;
  createdAt: string;
}
export interface AnnoucementResponse {
  _id: string;
  text: string;
  status: string;
  createdAt: string;
}
// const filterBlogData = (blogList: BlogList, type: string): BlogList => blogList?.filter(blog => blog?.type === type)
const getBlogList = async (params: BlogParams): Promise<Respone> => {
    const res = await HttpService.get('/pages/blogs', { params });
    return res?.data;
};

export const getBlogByParam = async (slug: string): Promise<BlogNewsResponse> => {
    const res = await HttpService.get(`/pages/news/${slug}`);
    return res?.data?.blog;
};

//get banner
export const getBanners = async (): Promise<BannerResponse> => {
    const res = await HttpService.get(`/pages/banners`);
    // console.log("res",res)
    return res?.data?.banners;
};

//get annoucement
export const getAnnoucement = async (): Promise<AnnoucementResponse> => {
    const res = await HttpService.get(`/pages/announcements`);
    return res?.data?.announcements[0];
};

export const useFetchBlogList = (params: BlogParams) => useQuery({
    queryKey: ['blog_lists'],
    queryFn: async () => getBlogList(params)
})

export const useFetchBanner = () => useQuery({
    queryKey: ['banner-list'],
    queryFn: async () => getBanners()
})
export const useFetchAnnoucement = () => useQuery({
    queryKey: ['annoucement'],
    queryFn: async () => getAnnoucement()
})

export const useFetchBlogDetails = (slug: string) => {
  return useQuery<BlogNewsResponse>({
    queryKey: ['blog_details', slug],
    queryFn: () => getBlogByParam(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}; 