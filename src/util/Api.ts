import Gate from "@/util/Gate";
import { Notify } from "quasar";

export default class Api{
    /* 관리자 */
    static async getAdminList(limit = 10, offset = 0, sort = "id", dir= "asc"){
        try{
            if(sort == null){
                sort = "id";
            }
            limit *= 2;
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/admin/list?limit=${limit}&offset=${offset}&sort=${sort}&dir=${dir}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }

    static adminProcess = true;
    static async addAdmin(account: string, password: string, name: string, level: number){
        // , subLevel: number
        if(!this.adminProcess){
            this.loading();
            return false;
        }
        this.adminProcess = false;

        const params = new URLSearchParams();
        params.append('name', name);
        params.append('password', password);
        params.append('level', level.toString());
        // params.append('sub_level', subLevel.toString());
        params.append('account', account);
        try{
            
            await Gate({
                method: "POST",
                url: `/api/v1/admin/admin/add`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: `관리자 생성에 성공하였습니다.`,
                position: "top",
            });
            this.adminProcess = true;
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: `관리자 생성 도중 문제가 발생하였습니다.`,
                position: "top",
            });
            this.adminProcess = true;
            return false;
        }
    }

    static async setAdminLevel(id: number, level: number){
        // , subLevel: number
        const params = new URLSearchParams();
        params.append('id', id.toString());
        params.append('level', level.toString());
        params.append('sub_level', level.toString());
        
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/admin/mod`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "변경에 성공했습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "변경하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    static async setAdmin(id: number, name: string, password: string){
        const params = new URLSearchParams();
        params.append('id', id.toString());
        params.append('name', name);
        params.append('password', password);
        
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/admin/mod`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "변경에 성공하였습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "변경하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    static async getLogList(limit = 10, offset = 0, sort = "id", dir= "asc"){
        try{
            if(sort == null){
                sort = "id";
            }
            limit *= 2;
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/admin/logs?limit=${limit}&offset=${offset}&sort=${sort}&dir=${dir}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }
    /* 관리자 */

    /* 회원관리 */
    static async getUserList(limit = 50, offset = 0, sort = "id", dir = "asc"){
        try{
            if(sort == null || sort == ""){
                sort = "id";
            }
            limit *= 2;
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/user/list?limit=${limit}&offset=${offset}&sort=${sort}&dir=${dir}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return false;
        }
    }

    static async getUserInquiry(limit = 50, offset = 0, sort: string, dir: string, userId: number){
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());
        params.append("sort", sort);
        params.append("dir", dir);
        params.append("user_id", userId.toString());
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/support/inquiries?${params.toString()}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }
    /* 회원관리 */

    /* 고객센터 */
    static async getNoticeList(limit = 50, offset = 0, sort = "id", dir = "asc"){
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/support/notices?limit=${limit}&offset=${offset}&no_answer=0&sort=${sort}&dir=${dir}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }

    static noticeProcess = true;
    static async addNotice(title: string, content: string, category: number){
        if(!this.noticeProcess){
            this.loading();
            return false;
        }
        this.noticeProcess = false;

        const params = new URLSearchParams();
        params.append('title', title);
        params.append('content', content);
        params.append('category', category.toString());
        params.append('img_link', "https://img.animalplanet.co.kr/news/2020/02/19/700/1365a2q9p47avck7n98j.jpg");
        params.append('start_at', "2020-10-29T07:55:28.000Z");
        params.append('end_at', "2020-10-29T07:55:28.000Z");
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/support/notice`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "공지사항이 성공적으로 작성되었습니다.",
                position: "top",
            });
            this.noticeProcess = true;
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "공지사항을 작성하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            this.noticeProcess = true;
            return false;
        }
    }

    static async deleteNotice(id: number){
        const params = new URLSearchParams();
        params.append('id', id.toString());
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/support/notice/del`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "공지사항이 성공적으로 삭제되었습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "공지사항을 삭제하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    static async modifyNotice(id: number, title: string, content: string, category: number){
        const params = new URLSearchParams();
        params.append('id', id.toString());
        params.append('title', title);
        params.append('content', content);
        params.append('category', category.toString());
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/support/notice/mod`,
                params,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
            });
            Notify.create({
                type: "positive",
                message: "공지사항이 성공적으로 수정되었습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "공지사항을 수정하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    static async getInquiryList(limit = 50, offset = 0, sort: string, dir: string){
        const params = new URLSearchParams();
        params.append("limit", limit.toString());
        params.append("offset", offset.toString());
        params.append("sort", sort);
        params.append("dir", dir);
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/support/inquiries?${params.toString()}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }

    static async getInquiryItem(id: number){
        const params = new URLSearchParams();
        params.append("id", id.toString());
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/support/inquiry?${params.toString()}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return false;
        }
    }

    static async responseInquiry(id: number, response: string){
        const params = new URLSearchParams();
        params.append("id", id.toString());
        params.append("response", response);
        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/support/response`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "성공적으로 답변이 작성되었습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "답변을 작성하는 도중 오류가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    static faqProcess = true;
    static async addFaq(category: number, q:string, a: string, file: File){ 
        if(!this.faqProcess){
            this.loading();
            return false;
        }
        this.noticeProcess = false;
        const formData = new FormData();
        formData.append('title', category.toString());
        formData.append('content', a);
        formData.append('category', q);
        formData.append('file', file);

        try{
            await Gate({
                method: "POST",
                url: `/api/v1/admin/support/notice`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                data :  formData
            });
            Notify.create({
                type: "positive",
                message: "FAQ가 성공적으로 작성되었습니다.",
                position: "top",
            });
            this.noticeProcess = true;
            return true;
        }catch(error){
            Notify.create({
                type: "negative",
                message: "FAQ를 작성하는 도중에 문제가 발생하였습니다.",
                position: "top",
            });
            this.noticeProcess = true;
            return false;
        }
    }
    /* 고객센터 */


    /* 게임 심사 */
    static async getProjectList(){
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/studio/versions`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }
    
    static async getProjectItem(index: number){
        const params = new URLSearchParams();
        params.append("version_id", index.toString());
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/studio/version?${params.toString()}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return false;
        }
    }

    static async JudgeProject(state: string, index: number, reason: string){
        const params = new URLSearchParams();
        params.append("state", state);
        params.append("id", index.toString());
        if(state === "fail"){
            params.append("reason", reason);
        }
        try{
            const result = await Gate({
                method: "POST",
                url: `/api/v1/admin/studio/version`,
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded"
                },
                params
            });
            Notify.create({
                type: "positive",
                message: "성공적으로 심사가 적용되었습니다.",
                position: "top",
            });
            return true;
        }catch(error){
            Notify.create({
                type: "positive",
                message: "심사하는 도중 문제가 발생하였습니다.",
                position: "top",
            });
            return false;
        }
    }

    /* 게임 심사 */


    /* 게임 관리 */

    // static async getGameList(){
    //     try{
    //         const result = await Gate({
    //             method: "GET",
    //             // url: `/api/v1/games`,
    //             headers: {
    //                 "Content-Type": "application/json",
    //             }
    //         });
    //         return result.data.result;
    //     }catch(error){
    //         return false;
    //     }
    // }

    /* 게임 관리 */

    
    static loading(){
        Notify.create({
            type: "negative",
            message: '서버 응답 대기중.',
            position: "top",
        });
    }

    static async getList( link : string, param : string ){
        try{
            const result = await Gate({
                method: "GET",
                url: `/api/v1/admin/${link}?${param}`,
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return result.data.result;
        }catch(error){
            return [];
        }
    }
}