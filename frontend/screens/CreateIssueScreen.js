import React, { useState } from 'react';
import { View, TextInput, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const CreateIssueScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
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
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    if (image) {
      // Prepare image for upload
      const localUri = image.uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('image', { uri: localUri, name: filename, type });
    }

    try {
      await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigation.goBack();
    } catch (e) {
      console.error('Upload failed', e);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, marginBottom: 10, padding: 8 }} />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />}
      <Button title="Submit Issue" onPress={submitIssue} />
    </View>
  );
};

export default CreateIssueScreen;