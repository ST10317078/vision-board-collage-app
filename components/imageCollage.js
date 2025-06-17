// components/ImageCollage.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export default function ImageCollage({
  images = [],
  columns = 10,
  gap = 2,
}) {
  const screenWidth = Dimensions.get('window').width;
  const imageSize = (screenWidth - (gap * columns)) / columns;

  return (
    <View style={styles.collageContainer}>
      {images.map((uri, index) => (
        <Image
          key={index}
          source={{ uri }}
          style={{
            width: imageSize,
            height: imageSize,
            margin: gap / 2,
          }}
          resizeMode="cover"
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  collageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
