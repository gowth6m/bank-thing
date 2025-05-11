import { useAuthStore } from "src/stores/auth-store";

import { SERVICE_CONFIG } from "./config";

export default class EventClient {
    private source: EventSource | null = null;

    subscribeToSyncEvents(onMessage: (data: any) => void, onError?: () => void) {
        const { token } = useAuthStore.getState();
        this.source = new EventSource(`${SERVICE_CONFIG.BASE_URL}/event/sync?token=${token.access}`);

        this.source.onmessage = (event) => {
            const payload = JSON.parse(event.data);
            onMessage(payload);
            this.source?.close(); // one-time listener
        };

        this.source.onerror = () => {
            console.warn('SSE error: sync-events');
            this.source?.close();
            if (onError) onError();
        };
    }

    unsubscribe() {
        this.source?.close();
        this.source = null;
    }
}
