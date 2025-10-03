import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';
import OTPTextView from 'react-native-otp-textinput';
import { Keyboard } from 'react-native';

export default function OtpVerificationScreen({ navigation }) {
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState('');

  const verifyOtp = async () => {
    Keyboard.dismiss();
    try {
      const response = await axios.post("http://192.168.55.105:3101/signup-verify-otp", {
        email,
        otp: otp.trim(),
      });

      if (response.data.message === "OTP verified successfully") {
        Toast.show({
          type: 'success',
          text1: 'Verified',
          text2: 'Account created successfully!',
          onHide: () => navigation.navigate('Login')
        });
        setOtp('');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid OTP',
          text2: 'Please try again',
        });
      }
    } catch (error) {
      if (error.response) {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: error.response.data.message || "Server Error",
        });
      } else if (error.request) {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: "No response from server",
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: error.message,
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>

      {/* OTP Input Boxes */}
      <OTPTextView
        containerStyle={styles.otpContainer}
        textInputStyle={styles.otpInput}
        inputCount={6}
        handleTextChange={(val) => setOtp(val)}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FF8000" },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  subtitle: { color: "#fff", marginBottom: 20, textAlign: "center" },
  otpContainer: { marginBottom: 20 },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: 45,
    height: 50,
    color: "#000",
    fontSize: 20,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30
  },
  buttonText: { color: "#FF8000", fontWeight: "bold", fontSize: 16 }
});
