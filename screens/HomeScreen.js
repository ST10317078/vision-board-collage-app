// screens/HomeScreen.js

import React, { useState } from 'react';
import { View, Text, Button, FlatList, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [images, setImages] = useState([]);
  const navigation = useNavigation();

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: 100,
        quality: 1,
      });

      if (!result.canceled) {
        const selected = result.assets.map((item) => item.uri);
        if (selected.length + images.length > 100) {
          Alert.alert('Limit Reached', 'You can only select up to 100 images.');
          return;
        }
        setImages([...images, ...selected]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Pick Images (Max 100)" onPress={pickImages} />
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        numColumns={4}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: 80, height: 80, margin: 4 }}
          />
        )}
      />
      {images.length > 0 && (
        <Button
          title="Generate Collage"
          onPress={() => navigation.navigate('Collage', { images })}
        />
      )}
    </View>
  );
}
