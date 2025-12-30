import NetInfo from "@react-native-community/netinfo";
import { useDowntimeStore } from "../store/useDowntimeStore";

const mockApiCall = async (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("[API] Received Data:", data);
      resolve(true);
    }, 1000);
  });
};

export const syncService = {
  syncPendingData: async () => {
    const state = useDowntimeStore.getState();
    const pendingEvents = state.events.filter((e) => !e.isSynced);

    if (pendingEvents.length === 0) return;

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      console.log("[Sync] No internet. Keeping data local.");
      return;
    }

    console.log(`[Sync] Found ${pendingEvents.length} pending items. Syncing...`);

    for (const event of pendingEvents) {
      await mockApiCall(event);
      useDowntimeStore.getState().markAsSynced(event.id);
    }
    
    console.log("[Sync] All items synced successfully.");
  }
};