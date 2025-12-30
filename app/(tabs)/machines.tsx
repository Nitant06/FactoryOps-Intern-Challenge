import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import MachineCard from '../../components/MachineCard';
import { useDowntimeStore } from '../../store/useDowntimeStore';
import { useMachineStore } from '../../store/useMachineStore';
import { syncService } from '../../utils/syncService';

export default function ShopFloorScreen() {
  const machines = useMachineStore((state) => state.machines);
  
  const pendingCount = useDowntimeStore((state) => state.getPendingCount());

  useEffect(() => {
    syncService.syncPendingData();
  }, []);

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-4">
    
      {pendingCount > 0 && (
        <TouchableOpacity 
          onPress={() => syncService.syncPendingData()}
          className="bg-orange-100 border border-orange-300 p-3 rounded-lg mb-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <Ionicons name="cloud-offline" size={20} color="#c2410c" />
            <Text className="text-orange-800 font-bold ml-2">
              {pendingCount} items pending upload
            </Text>
          </View>
          <Text className="text-orange-600 text-xs font-bold">TAP TO SYNC</Text>
        </TouchableOpacity>
      )}

      <Text className="text-2xl font-bold text-gray-800 mb-4">Shop Floor</Text>
      
      <FlatList
        data={machines}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MachineCard machine={item} />}
      />
    </View>
  );
}