import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { REASON_TREE, useDowntimeStore } from '../../store/useDowntimeStore';
import { useMachineStore } from '../../store/useMachineStore';

export default function MachineDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const machines = useMachineStore((state) => state.machines);
  const addEvent = useDowntimeStore((state) => state.addEvent);
  const machine = machines.find((m) => m.id === id);

  const [isReporting, setIsReporting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  
  // Maintenance State
  const [maintNotes, setMaintNotes] = useState("");
  const [tasks, setTasks] = useState([
    { id: 1, label: 'Check Hydraulics', completed: false },
    { id: 2, label: 'Inspect Safety Guard', completed: false },
    { id: 3, label: 'Lubricate Rollers', completed: false },
  ]);

  if (!machine) return <View className="flex-1 justify-center items-center"><Text>Machine not found</Text></View>;

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Camera access is required for photos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, 
    });

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
      );
      setPhotoUri(manipulated.uri);
    }
  };

  const handleSubmitDowntime = () => {
    if (!selectedCategory || !selectedReason) {
      Alert.alert("Required", "Please select a reason category.");
      return;
    }
    addEvent({
      machineId: machine.id,
      type: 'DOWNTIME',
      reasonCategory: selectedCategory,
      reasonCode: selectedReason,
      photoUri: photoUri || undefined,
      timestamp: new Date().toISOString(),
    });
    Alert.alert("Saved", "Downtime recorded. Will sync automatically.");
    setIsReporting(false);
    resetForm();
    router.back();
  };

  const handleMaintenanceComplete = (taskLabel: string) => {
    addEvent({
      machineId: machine.id,
      type: 'MAINTENANCE',
      maintenanceTask: taskLabel,
      maintenanceNotes: maintNotes,
      timestamp: new Date().toISOString(),
    });
    Alert.alert("Logged", "Maintenance task saved.");
  };

  const toggleTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.completed) {
        handleMaintenanceComplete(task!.label);
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedReason(null);
    setPhotoUri(null);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen options={{ title: "Machine Details", headerBackTitle: "Back" }} />

      {/* KPI Card */}
      <View className="bg-white p-6 border-b border-gray-200">
        <Text className="text-3xl font-bold text-gray-800">{machine.name}</Text>
        <View className="flex-row items-center mt-2 mb-4">
          <View className={`w-4 h-4 rounded-full mr-2 ${machine.status === 'RUN' ? 'bg-green-500' : 'bg-red-500'}`} />
          <Text className="text-lg font-semibold text-gray-700">Status: {machine.status}</Text>
        </View>
      </View>

      <View className="p-4">
        {/* DOWNTIME REPORTING */}
        {!isReporting ? (
          <Pressable 
            onPress={() => setIsReporting(true)}
            className="bg-red-600 p-5 rounded-xl flex-row justify-center items-center shadow-md active:bg-red-700 mb-6"
          >
            <Ionicons name="warning" size={24} color="white" style={{marginRight: 10}} />
            <Text className="text-white text-xl font-bold">Report Downtime</Text>
          </Pressable>
        ) : (
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Report Issue</Text>
              <Pressable onPress={() => setIsReporting(false)}>
                <Ionicons name="close-circle" size={28} color="#9ca3af" />
              </Pressable>
            </View>
            
            {/* Reason Tree */}
            <Text className="text-gray-500 mb-2 font-semibold">Category</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {REASON_TREE.map((cat) => (
                <Pressable
                  key={cat.code}
                  onPress={() => { setSelectedCategory(cat.code); setSelectedReason(null); }}
                  className={`px-4 py-2 rounded-lg border ${selectedCategory === cat.code ? 'bg-blue-100 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
                >
                  <Text className={selectedCategory === cat.code ? 'text-blue-700 font-bold' : 'text-gray-600'}>{cat.label}</Text>
                </Pressable>
              ))}
            </View>

            {selectedCategory && (
              <>
                <Text className="text-gray-500 mb-2 font-semibold">Specific Reason</Text>
                <View className="flex-row flex-wrap gap-2 mb-6">
                  {REASON_TREE.find(c => c.code === selectedCategory)?.children.map((child) => (
                    <Pressable
                      key={child.code}
                      onPress={() => setSelectedReason(child.code)}
                      className={`px-4 py-2 rounded-lg border ${selectedReason === child.code ? 'bg-red-100 border-red-500' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <Text className={selectedReason === child.code ? 'text-red-700 font-bold' : 'text-gray-600'}>{child.label}</Text>
                    </Pressable>
                  ))}
                </View>

                {/* PHOTO BUTTON */}
                <Text className="text-gray-500 mb-2 font-semibold">Attachment (Optional)</Text>
                <Pressable onPress={takePhoto} className="flex-row items-center mb-6 border border-gray-300 p-3 rounded-lg border-dashed">
                  <Ionicons name="camera" size={24} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{photoUri ? "Photo Attached (Click to retake)" : "Take Photo"}</Text>
                </Pressable>
                {photoUri && <Image source={{ uri: photoUri }} style={{ width: 100, height: 100, marginBottom: 20, borderRadius: 10 }} />}

                <Pressable 
                  onPress={handleSubmitDowntime}
                  className={`p-4 rounded-xl items-center ${selectedReason ? 'bg-blue-600' : 'bg-gray-300'}`}
                  disabled={!selectedReason}
                >
                  <Text className="text-white font-bold text-lg">Submit Report</Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {/* MAINTENANCE CHECKLIST */}
        <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
          <View className="bg-gray-100 p-4 border-b border-gray-200">
            <Text className="font-bold text-gray-700 text-lg">Maintenance Log</Text>
          </View>
          
          <View className="p-4 border-b border-gray-100">
             <Text className="text-gray-500 mb-2">Notes (Optional)</Text>
             <TextInput 
                value={maintNotes}
                onChangeText={setMaintNotes}
                placeholder="Enter observations..."
                className="border border-gray-300 rounded p-2"
             />
          </View>

          {tasks.map((task) => (
            <Pressable 
              key={task.id} 
              onPress={() => toggleTask(task.id)}
              className="p-4 border-b border-gray-100 flex-row items-center"
            >
              <View className={`w-6 h-6 rounded border mr-3 items-center justify-center ${task.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
              </View>
              <Text className={`text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                {task.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}