const baseUrl = "/api/blog"
const settingUrl = baseUrl+"/getSetting"
const settingChangeUrl= baseUrl+"/editSetting"
const blogsUrl =baseUrl+"/blogs"
// const uploadUrl = baseUrl+"/upload"
import axios from "../utils/request"
// 实现函数

export function getAllSetting(){
    return axios.get(settingUrl)
}
export function saveSettingInfo(data:any){
    return axios.post(settingChangeUrl,data)
}
export function getAllBlogs(){
    return axios.get(blogsUrl)
}
export function addBlog(data: any){
    return axios.post(blogsUrl,data)
}
export function editBlogById(data:any){
    return axios.put(blogsUrl,data)
}
export function deleBlogById(id:string|number){
    return axios.delete(blogsUrl+"/"+id)
}
export {
    baseUrl
}