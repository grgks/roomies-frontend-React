import type {Invitation, InvitationInsert, InvitationFilters} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";


//POST /api/invitations - send invitation
export const sendInvitation =
    async (data: InvitationInsert): Promise<Invitation> => {

        const res = await axiosInstance.post('/api/invitations', data);
        return res.data;
}

//PUT /api/invitations/{id}/accept - accept invitation from another roommate
export const acceptInvitation =
    async(id: number): Promise<Invitation> => {

        const res =
            await axiosInstance.put(`/api/invitations/${id}/accept`);
    return res.data;
   }

//PUT /api/invitations/{id}/reject - reject invitation from other roommate
export const rejectInvitation =
    async(id: number): Promise<Invitation> => {

        const res =
            await axiosInstance.put(`/api/invitations/${id}/reject`);
        return res.data;
    }

//GET  /api/invitations/incoming - get my incoming invitations
export const getMyIncomingInvitations =
    async(filters: InvitationFilters): Promise<Invitation[]> =>{
    const res = await axiosInstance.get(`/api/invitations/incoming`,
        { params: filters });
    return res.data;
    }

 //GET  /api/invitations/outgoing - get my outgoing invitations
export const getMyOutgoingInvitations =
    async(filters: InvitationFilters): Promise<Invitation[]> =>{
        const res = await axiosInstance.get(`/api/invitations/outgoing`,{ params: filters });
        return res.data;
    }