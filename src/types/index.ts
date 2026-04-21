import { TaskStatus, InvitationStatus, ExpenseSplitStatus, RatingCategory } from './enums';

// User
export interface User {
    id: number;
    keycloakId: string;
    email: string;
    isActive: boolean;
}

// Roommate
export interface Roommate {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    userId: number;
    houseId: number | null;
}

// House
export interface House {
    id: number;
    name: string;
    address: string;
    city: string;
    area: string;
}

// Invitation
export interface Invitation {
    id: number;
    status: InvitationStatus;
    senderRoommateId: number;
    receiverRoommateId: number;
    houseId: number;
    createdAt: string;
}

// Task
export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    assignedToRoommateId: number | null;
    houseId: number;
    dueDate: string | null;
}

// Expense
export interface Expense {
    id: number;
    title: string;
    amount: number;
    paidByRoommateId: number;
    houseId: number;
    createdAt: string;
}

// ExpenseSplit
export interface ExpenseSplit {
    id: number;
    expenseId: number;
    roommateId: number;
    amount: number;
    status: ExpenseSplitStatus;
}

// Rating
export interface Rating {
    id: number;
    score: number;
    category: RatingCategory;
    raterRoommateId: number;
    ratedRoommateId: number;
    createdAt: string;
}

// Message
export interface Message {
    id: number;
    senderId: number;
    receiverId: number | null;
    houseId: number;
    content: string;
    isRead: boolean;
    createdAt: string;
}