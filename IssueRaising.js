import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Picker } from '@react-native-picker/picker';


const IssueRaiseScreen = () => {
  const [issueType, setIssueType] = useState('');
  const [priority, setPriority] = useState('');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const storedEmail = await AsyncStorage.getItem('userEmail');
      const storedName = await AsyncStorage.getItem('userName');
      setEmail(storedEmail || '');
      setUsername(storedName || '');
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!issueType || !priority || !description) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all required fields!',
      });
      return;
    }

    try {
      await axios.post('http://192.168.55.102:3101/raise-issue', {
        email,
        username,
        issue_type: issueType,
        priority,
        description,
        order_id: orderId,
      });

      Toast.show({
        type: 'success',
        text1: 'Issue Raised Successfully!',
      });

      setIssueType('');
      setPriority('');
      setDescription('');
      setOrderId('');
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to raise issue!',
      });
    }
  };

  return (
    <LinearGradient colors={['#db8b3cff','#90178aff']} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Animatable.Text animation="fadeInDown" style={styles.heading}>
          🚨 Raise an Issue
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={100} style={styles.card}>
          
          {/* Issue Type */}
          <Text style={styles.label}>Issue Type *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={issueType}
              onValueChange={(itemValue) => setIssueType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Issue Type" value="" />
              <Picker.Item label="App is slow" value="App is slow" />
              <Picker.Item label="Wrong item delivered" value="Wrong item delivered" />
              <Picker.Item label="Food quality is bad" value="Food quality is bad" />
              <Picker.Item label="App crashed during order" value="App crashed during order" />
              <Picker.Item label="Canteen closed unexpectedly" value="Canteen closed unexpectedly" />
              <Picker.Item label="Delayed service" value="Delayed service" />
              <Picker.Item label="Wrong item parcel" value="Wrong item parcel" />  
              <Picker.Item label="Rude behavior from Canteen staff" value="Rude behavior from Canteen staff" />
              <Picker.Item label="Price mismatch in app and bill" value="Price mismatch in app and bill" />
              <Picker.Item label="Not able to login" value="Not able to login" />
              <Picker.Item label="Not able to sign up" value="Not able to sign up" />
              <Picker.Item label="Item served cold" value="Item served cold" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          {/* Priority */}
          <Text style={styles.label}>Priority *</Text>
          <View style={styles.priorityContainer}>
            {['High', 'Medium', 'Low'].map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.priorityButton,
                  priority === p && styles.prioritySelected(p),
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.priorityText,
                  priority === p && { color: '#fff' }
                ]}>
                  {p === "High" ? "🔴 High" : p === "Medium" ? "🟠 Medium" : "🟢 Low"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            placeholder="Briefly describe the issue..."
            placeholderTextColor="#999"
          />

          {/* Order ID */}
          <Text style={styles.label}>Order ID (optional)</Text>
          <TextInput
            style={styles.input}
            value={orderId}
            onChangeText={setOrderId}
            placeholder="Enter Order ID (if any)"
            placeholderTextColor="#999"
          />

          {/* Submit */}
          <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={4000}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
              <LinearGradient
                colors={['#d05bcaff', '#FF8000']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>📨 Submit Issue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>

        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  heading: {
    marginTop:20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#640D5F',
    textAlign: 'center',
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 8,
    color: '#2d3436',
    fontWeight: '600',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    color: '#2d3436',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: '#f1f2f6',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2d3436',
  },
  prioritySelected: (p) => ({
    backgroundColor: p === "High" ? "#e74c3c" : p === "Medium" ? "#f39c12" : "#27ae60",
  }),
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 15,
  },
  textArea: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 28,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default IssueRaiseScreen;

