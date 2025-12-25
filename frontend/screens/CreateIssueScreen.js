import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CreateIssueScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // We are defaulting to Infrastructure for now to keep it simple
  const [category] = useState('Infrastructure'); 
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const submitIssue = async () => {
    if (!title || !description) {
        Alert.alert("Missing Fields", "Please add a title and description");
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    if (image) {
      const localUri = image.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      formData.append('image', { uri: localUri, name: filename, type });
    }

    try {
      await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      Alert.alert("Success", "Issue Reported!");
      navigation.goBack();
    } catch (e) {
      console.error('Upload failed', e);
      Alert.alert("Error", "Could not submit issue");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }} />
      
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
      
      <View style={{ marginTop: 20 }}>
        <Button title="Submit Issue" onPress={submitIssue} />
      </View>
    </View>
  );
};

export default CreateIssueScreen;