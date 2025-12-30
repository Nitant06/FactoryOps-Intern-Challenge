import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useMachineStore } from '../../store/useMachineStore';

export default function LoginScreen() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'operator' | 'supervisor'>('operator');

  const login = useAuthStore((state) => state.login);
  const initMachines = useMachineStore((state) => state.initializeMachines);

  const handleLogin = () => {
    if (!email) {
      alert("Please enter an email");
      return;
    }
    
    login(email, role);
    
    initMachines();
    
    router.replace('/(tabs)/machines'); 
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <View className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <Text className="text-2xl font-bold mb-6 text-center text-gray-800">
          FactoryOps Login
        </Text>

        {/* Email Input */}
        <Text className="mb-2 text-gray-600 font-semibold">Email</Text>
        <TextInput 
          className="border border-gray-300 rounded-lg p-3 mb-4 text-lg"
          placeholder="operator@factory.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Role Toggle */}
        <Text className="mb-2 text-gray-600 font-semibold">Select Role</Text>
        <View className="flex-row mb-6 border border-blue-500 rounded-lg overflow-hidden">
          <Pressable 
            onPress={() => setRole('operator')}
            className={`flex-1 p-3 ${role === 'operator' ? 'bg-blue-500' : 'bg-white'}`}
          >
            <Text className={`text-center font-bold ${role === 'operator' ? 'text-white' : 'text-blue-500'}`}>
              Operator
            </Text>
          </Pressable>
          <Pressable 
            onPress={() => setRole('supervisor')}
            className={`flex-1 p-3 ${role === 'supervisor' ? 'bg-blue-500' : 'bg-white'}`}
          >
            <Text className={`text-center font-bold ${role === 'supervisor' ? 'text-white' : 'text-blue-500'}`}>
              Supervisor
            </Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Pressable 
          onPress={handleLogin}
          className="bg-blue-600 p-4 rounded-xl active:bg-blue-700"
        >
          <Text className="text-white text-center font-bold text-lg">
            Enter Shop Floor
          </Text>
        </Pressable>
      </View>
    </View>
  );
}