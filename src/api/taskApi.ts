import type {Task, TaskFilters, TaskInsert, TaskUpdate} from "@/types";
import axiosInstance from "@/services/axiosInstance.ts";



//POST /api/task - create task
export const createTask =
    async (data: TaskInsert): Promise<Task> => {
    const res = await axiosInstance.post('/api/task', data);
    return res.data;
   }

//GET /api/task/{id} - Get task by Id
export const getTaskById =
    async(id: number): Promise<Task> => {
    const res = await axiosInstance.get(`/api/task/${id}`);
    return res.data;
   }

// GET /api/task/house/{houseId} - get tasks by house
export const getTasksByHouse =
    async (houseId: number): Promise<Task[]> => {
        const res = await axiosInstance.get(`/api/task/house/${houseId}`);
        return res.data;
    }


//PUT /api/task/{id} - update task by Id
export const updateTaskById =
    async(id: number, data: TaskUpdate): Promise<Task> => {
        const res = await axiosInstance.put(`/api/task/${id}`, data);
        return res.data;
   }

//PUT /api/task/{id}/status - update taskStatus by Id
export const updateTaskStatusById =
    async(id: number, status: string): Promise<Task> => {

        //null is for body (empty) and { params: { status } }
        // puts status as query parameter: /api/task/1/status?status=DONE.
        const res = await axiosInstance.put(`/api/task/${id}/status`,
            null, { params: { status } });
        return res.data;
    }

//GET /api/task/me - get my tasks
export const getMyTasks =
    async(): Promise<Task[]> => {
    const res = await axiosInstance.get('/api/task/me');
    return res.data;
}

//GET //api/task/search
export const searchTasks =
    async(filters: TaskFilters): Promise<Task[]> => {
    const res = await axiosInstance.get('/api/task/search',
        {params: filters});
    return res.data;
    }

//PUT /api/task/{taskId}/assign - Assign myself to task
export const assignMyselfTask =
    async(taskId: number): Promise<Task> => {
    const res = await axiosInstance.put(`/api/task/${taskId}/assign`);
    return res.data;
    }

//PUT /api/task/{taskId}/unassign - Unassign myself to task
export const unassignMyselfTask =
    async(taskId: number): Promise<Task> => {
        const res = await axiosInstance.put(`/api/task/${taskId}/unassign`);
        return res.data;
    }

//GET /api/task/house/{houseId}/week - Get tasks for current week
export const getTaskForCurrentWeek =
    async (houseId: number): Promise<Task[]> => {
    const res =
        await axiosInstance.get(`/api/task/house/${houseId}/week`);
    return res.data;
}

//DELETE /api/task/{id} - delete task
export const deleteTask =
    async(id: number): Promise<void> => {
    await axiosInstance.delete(`/api/task/${id}`);
    }

























