export interface EventPayload {
    type: string; // e.g. 'transactions-updated', 'job-completed'
    userId: string; // ID of the user associated with the event
    timestamp: string; // ISO 8601 timestamp of when the event occurred
    data?: Record<string, any>;
}
