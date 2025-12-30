import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useAlertStore } from '../../store/useAlertStore';

const useAlertStream = () => {
  const addAlert = useAlertStore((state) => state.addAlert);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMachine = Math.random() > 0.5 ? "Cutter 1" : "Roller A";
      const newAlert = {
        id: Math.random().toString(),
        machineName: randomMachine,
        message: "Temperature exceeds limit (simulated)",
        severity: 'high' as const,
        timestamp: new Date().toLocaleTimeString(),
      };
      
      console.log("New Alert Received:", newAlert.machineName);
      addAlert(newAlert);
    }, 5000); // New alert every 5 seconds

    return () => clearInterval(interval);
  }, []);
};

export default function SupervisorScreen() {
  const { alerts, acknowledgeAlert } = useAlertStore();
  
  useAlertStream();

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Alert Stream</Text>
      <Text className="text-gray-500 mb-4">Live incoming events...</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl shadow-sm mb-3 border-l-4 border-red-500 flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-xs text-gray-400 font-bold">{item.timestamp}</Text>
              <Text className="text-lg font-bold text-gray-800">{item.machineName}</Text>
              <Text className="text-red-600">{item.message}</Text>
            </View>

            <Pressable 
              onPress={() => acknowledgeAlert(item.id)}
              className="bg-gray-100 p-2 rounded-full"
            >
              <Ionicons name="checkmark" size={24} color="green" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Text className="text-gray-400">No active alerts.</Text>
            <Text className="text-gray-400 text-xs">Waiting for stream...</Text>
          </View>
        }
      />
    </View>
  );
}