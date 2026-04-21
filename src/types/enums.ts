// Αντί για enum, χρησιμοποιούμε const object
export const TaskStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
} as const;
export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const InvitationStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
} as const;
export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

export const ExpenseSplitStatus = {
    PAID: 'PAID',
    UNPAID: 'UNPAID',
} as const;
export type ExpenseSplitStatus = typeof ExpenseSplitStatus[keyof typeof ExpenseSplitStatus];

export const RatingCategory = {
    CLEANLINESS: 'CLEANLINESS',
    NOISE: 'NOISE',
    BILLS: 'BILLS',
    COMMUNICATION: 'COMMUNICATION',
    OVERALL: 'OVERALL',
} as const;
export type RatingCategory = typeof RatingCategory[keyof typeof RatingCategory];