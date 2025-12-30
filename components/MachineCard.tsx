import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'RUN': return 'bg-green-500';
    case 'IDLE': return 'bg-orange-500';
    case 'OFF': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

interface Props {
  machine: {
    id: string;
    name: string;
    type: string;
    status: string;
  };
}

export default function MachineCard({ machine }: Props) {
  const router = useRouter();

  return (
    <Pressable 
      onPress={() => router.push({ pathname: "/machine/[id]", params: { id: machine.id } })}
      className="bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-200 flex-row justify-between items-center"
    >
      <View>
        <Text className="text-lg font-bold text-gray-800">{machine.name}</Text>
        <Text className="text-gray-500 text-sm capitalize">{machine.type}</Text>
      </View>

      <View className={`px-3 py-1 rounded-full ${getStatusColor(machine.status)}`}>
        <Text className="text-white font-bold text-xs">{machine.status}</Text>
      </View>
    </Pressable>
  );
}