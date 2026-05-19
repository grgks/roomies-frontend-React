// For enum, we use const object

//Gender
export const Gender = {
    FEMALE: 'FEMALE',
    MALE: 'MALE',
    OTHER: 'OTHER',
    PREFER_NOT_TO_SAY: 'PREFER_NOT_TO_SAY',
}as const;
export type Gender = typeof Gender[keyof typeof Gender]


//TaskStatus
export const TaskStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    OVERDUE: 'OVERDUE',
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];


//TaskCategory
export const TaskCategory = {
    INDOOR_CLEANING: 'INDOOR_CLEANING',
    OUTDOOR_CLEANING: 'OUTDOOR_CLEANING',
    GROCERY_SHOPPING: 'GROCERY_SHOPPING',
    COOKING: 'COOKING',
    DISHES: 'DISHES',
    MAINTENANCE: 'MAINTENANCE',
    PET_CARE: 'PET_CARE',
    OTHER: 'OTHER',
} as const;
export type TaskCategory = typeof TaskCategory[keyof typeof TaskCategory];


//InvitationStatus
export const InvitationStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    EXPIRED: 'EXPIRED',
} as const;
export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];


//ExpenseSplitStatus
export const ExpenseSplitStatus = {
    PAID: 'PAID',
    UNPAID: 'UNPAID',
} as const;
export type ExpenseSplitStatus = typeof ExpenseSplitStatus[keyof typeof ExpenseSplitStatus];


//RatingCategory
export const RatingCategory = {
    TASKS_COMPLETED: 'TASKS_COMPLETED',
    TASKS_INITIATIVE: 'TASKS_INITIATIVE',
    COHABITATION: 'COHABITATION',
    COMMUNICATION: 'COMMUNICATION',
} as const;
export type RatingCategory = typeof RatingCategory[keyof typeof RatingCategory];