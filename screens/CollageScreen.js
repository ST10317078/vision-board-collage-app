// screens/CollageScreen.js
import React, { useRef, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import ImageCollage from '../components/imageCollage';

export default function CollageScreen({ route }) {
  const { images } = route.params;
  const collageRef = useRef();
  const [columns, setColumns] = useState(10);
  const [isSaving, setIsSaving] = useState(false);
  const [viewReady, setViewReady] = useState(false);

  const saveCollage = async () => {
    if (!collageRef.current) {
      alert('Please wait for the collage to load');
      return;
    }
    
    setIsSaving(true);
    try {
      // Add a small delay to ensure the view is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const uri = await captureRef(collageRef.current, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });
      await MediaLibrary.saveToLibraryAsync(uri);
      alert('Collage saved to your gallery!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save collage. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.columnSelector}>
        <Text style={styles.sectionTitle}>Choose Layout</Text>
        <Text style={styles.subtitle}>Select number of columns</Text>
        
        <View style={styles.columnButtonContainer}>
          {[
            { value: 5, label: '5 Columns', desc: 'Large' },
            { value: 10, label: '10 Columns', desc: 'Medium' },
            { value: 20, label: '20 Columns', desc: 'Small' }
          ].map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.columnButton,
                columns === option.value && styles.columnButtonActive
              ]}
              onPress={() => setColumns(option.value)}
            >
              <Text style={[
                styles.columnButtonText,
                columns === option.value && styles.columnButtonTextActive
              ]}>
                {option.value}
              </Text>
              <Text style={[
                styles.columnButtonDesc,
                columns === option.value && styles.columnButtonDescActive
              ]}>
                {option.desc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View 
        ref={collageRef} 
        style={styles.collageWrapper} 
        collapsable={false}
        onLayout={() => setViewReady(true)}
      >
        <ImageCollage images={images} columns={columns} gap={2} />
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton, 
            (isSaving || !viewReady) && styles.saveButtonDisabled
          ]}
          onPress={saveCollage}
          disabled={isSaving || !viewReady}
        >
          <Text style={styles.saveButtonText}>
            {!viewReady ? 'Loading...' : isSaving ? 'Saving...' : '💾 Save to Gallery'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  columnSelector: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  columnButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  columnButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  columnButtonActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007bff',
  },
  columnButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
  },
  columnButtonTextActive: {
    color: '#007bff',
  },
  columnButtonDesc: {
    fontSize: 12,
    color: '#adb5bd',
    marginTop: 4,
  },
  columnButtonDescActive: {
    color: '#0056b3',
  },
  collageWrapper: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#28a745',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});