import type { Message, MessageInsert} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";


//POST /api/messages - send message
export const sendMessage =
    async(data: MessageInsert): Promise<Message> => {
    const res = await axiosInstance.post('/api/messages', data);
    return res.data;
    }

//GET /api/messages/sent - get my sent messages
export const getMySentMessage =
    async(): Promise<Message[]> => {
        const res = await axiosInstance.get('/api/messages/sent');
        return res.data;
    }

//GET /api/messages/received - get my received messages
export const getMyReceivedMessage =
    async(): Promise<Message[]> => {
        const res = await axiosInstance.get('/api/messages/received');
        return res.data;
    }

//GET /api/messages/house/{houseId} - get messages by houseId
export const getMessagesByHouseId =
    async(houseId: number): Promise<Message[]> => {
    const res =
        await axiosInstance.get(`/api/messages/house/${houseId}`);
    return res.data;
    }

//GET /api/messages/unread - get my unread messages
export const getMyUnreadMessage =
    async(): Promise<Message[]> => {
        const res = await axiosInstance.get('/api/messages/unread');
        return res.data;
    }

//PUT /api/messages/{id}/read - mark message as read
export const markMessageAsRead =
    async(id: number): Promise<Message> => {
    const res = await axiosInstance.put(`/api/messages/${id}/read`);
        return res.data;
    }

//DELETE /api/messages/{id} - delete message by id
export const deleteMessage =
    async(id: number): Promise<void> => {
        await axiosInstance.delete(`/api/messages/${id}`);
    }























