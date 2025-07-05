import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const API_BASE_URL = __DEV__ 
  ? 'https://77d2-83-144-23-154.ngrok-free.app'  // Your actual ngrok URL
  : 'https://your-production-api.com';

interface FaceRecognitionResult {
  verified: boolean;
  distance: number;
  threshold: number;
  model: string;
  message: string;
}

interface AIExtractionResult {
  filename: string;
  extracted_text: string;
  model: string;
  status: string;
}

interface IDVerificationResult {
  verification_id: string;
  face_verified: boolean;
  face_confidence: number;
  extracted_info: string;
  status: string;
  message: string;
}

class APIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method to create proper file object for React Native
  private createFileObject(uri: string, filename: string, type: string = 'image/jpeg') {
    return {
      uri,
      type,
      name: filename,
    } as any;
  }

  async faceRecognition(image1Uri: string, image2Uri: string): Promise<FaceRecognitionResult> {
    const formData = new FormData();
    
    // Use the helper method to create proper file objects
    formData.append('img1', this.createFileObject(image1Uri, 'img1.jpg'));
    formData.append('img2', this.createFileObject(image2Uri, 'img2.jpg'));

    const response = await fetch(`${this.baseUrl}/face-recognition`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Face recognition failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async extractTextFromImage(imageUri: string, prompt?: string): Promise<AIExtractionResult> {
    const formData = new FormData();
    
    formData.append('file', this.createFileObject(imageUri, 'document.jpg'));

    if (prompt) {
      formData.append('prompt', prompt);
    }

    const response = await fetch(`${this.baseUrl}/ai-extract`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Text extraction failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Convert image URI to base64 with better error handling
  private async uriToBase64(uri: string): Promise<string> {
    try {
      console.log('Converting URI to base64:', uri);
      
      // Check if URI is valid
      if (!uri || typeof uri !== 'string') {
        throw new Error('Invalid URI provided');
      }

      // Check if file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log('File info:', fileInfo);
      
      if (!fileInfo.exists) {
        throw new Error('File does not exist at the provided URI');
      }

      // Convert to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('Base64 conversion successful, length:', base64.length);
      return base64;
      
    } catch (error) {
      console.error('Error converting URI to base64:', error);
      console.error('URI was:', uri);
      throw new Error(`Failed to convert image to base64: ${error.message}`);
    }
  }

  // Alternative method using XMLHttpRequest for different URI formats
  private async uriToBase64Alternative(uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        console.log('Trying alternative base64 conversion for:', uri);
        
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (this.status === 200) {
            const reader = new FileReader();
            reader.onloadend = function() {
              const base64 = (reader.result as string).split(',')[1];
              console.log('Alternative base64 conversion successful');
              resolve(base64);
            };
            reader.onerror = function() {
              reject(new Error('FileReader error'));
            };
            reader.readAsDataURL(xhr.response);
          } else {
            reject(new Error(`HTTP error: ${this.status}`));
          }
        };
        xhr.onerror = function() {
          reject(new Error('Network error'));
        };
        xhr.open('GET', uri);
        xhr.responseType = 'blob';
        xhr.send();
      } catch (error) {
        reject(error);
      }
    });
  }

  async verifyIDWithSelfie(idCardUri: string, selfieUri: string): Promise<IDVerificationResult> {
    try {
      console.log('Starting ID verification...');
      console.log('ID Card URI:', idCardUri);
      console.log('Selfie URI:', selfieUri);

      // Convert images to base64
      console.log('Converting ID card to base64...');
      const idCardBase64 = await this.uriToBase64(idCardUri);

      console.log('Converting selfie to base64...');
      const selfieBase64 = await this.uriToBase64(selfieUri);

      console.log('Base64 conversion complete');

      // Send as JSON with base64 data
      const requestBody = {
        id_card_base64: idCardBase64,
        selfie_base64: selfieBase64,
      };

      console.log('Sending request to:', `${this.baseUrl}/id-verify-base64`);

      const response = await fetch(`${this.baseUrl}/id-verify-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`ID verification failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Verification result:', result);
      
      return result;
      
    } catch (error) {
      console.error('API Service Error:', error);
      throw error;
    }
  }

  async healthCheck(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}

export const apiService = new APIService();
export type { FaceRecognitionResult, AIExtractionResult, IDVerificationResult }; 