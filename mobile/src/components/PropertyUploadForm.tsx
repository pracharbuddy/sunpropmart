import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from '../lib/supabase';

interface PropertyUploadFormProps {
  agentId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PropertyUploadForm: React.FC<PropertyUploadFormProps> = ({
  agentId,
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [price, setPrice] = useState('');
  const [rent, setRent] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [locality, setLocality] = useState('Sector 4');
  const [city, setCity] = useState('Greater Noida West');
  const [description, setDescription] = useState('');
  const [reraNumber, setReraNumber] = useState('');

  // Media state
  const [images, setImages] = useState<string[]>([]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Array<{ name: string; uri: string }>>([]);

  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  // 1. Pick Photos from Gallery with optional compression
  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        // Compress images to optimize bandwidth
        const compressedUris: string[] = [];
        for (const asset of result.assets) {
          const manipulated = await ImageManipulator.manipulateAsync(
            asset.uri,
            [{ resize: { width: 1600 } }],
            { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
          );
          compressedUris.push(manipulated.uri);
        }
        setImages((prev) => [...prev, ...compressedUris]);
      }
    } catch {
      Alert.alert('Image Selection Error', 'Could not access photo library.');
    }
  };

  // 2. Capture Photo via Camera
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is needed to capture photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0]) {
        const manipulated = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1600 } }],
          { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
        );
        setImages((prev) => [...prev, manipulated.uri]);
      }
    } catch {
      Alert.alert('Camera Error', 'Could not capture photo.');
    }
  };

  // 3. Record or Select Video
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setVideoUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Video Error', 'Could not select video.');
    }
  };

  // 4. Select Document (PDF / DOC)
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setDocuments((prev) => [
          ...prev,
          { name: result.assets[0].name, uri: result.assets[0].uri },
        ]);
      }
    } catch {
      Alert.alert('Document Error', 'Could not select document.');
    }
  };

  // 5. Submit or Save Draft to Supabase
  const handleSave = async (submitForReview: boolean) => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter a property title.');
      return;
    }
    if (!price && !rent) {
      Alert.alert('Validation Error', 'Please provide price or rental amount.');
      return;
    }
    if (!area) {
      Alert.alert('Validation Error', 'Please provide total super area in sq.ft.');
      return;
    }

    setIsUploading(true);
    setUploadProgress('Preparing property payload...');

    try {
      const numericPrice = Number(price) || 0;
      const numericRent = Number(rent) || 0;
      const numericArea = Number(area) || 0;
      const priceSqft = numericArea > 0 ? Math.round(numericPrice / numericArea) : 0;

      // Generates a slug
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString().slice(-4)}`;

      // Default featured image fallback or first image
      const featuredImage =
        images.length > 0
          ? images[0]
          : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

      setUploadProgress('Writing to Supabase database...');

      const payload = {
        title,
        slug,
        property_type: propertyType,
        category: 'residential',
        listing_type: listingType,
        price: numericPrice,
        rent: numericRent,
        price_sqft: priceSqft,
        area: numericArea,
        bedrooms: Number(bedrooms) || 3,
        bathrooms: Number(bathrooms) || 3,
        locality,
        city,
        address: `${locality}, ${city}`,
        description,
        rera_number: reraNumber || null,
        furnishing: 'Semi-Furnished',
        featured_image: featuredImage,
        gallery_images: images,
        video_url: videoUri,
        amenities: ['Power Backup', '24/7 Security', 'Clubhouse', 'Car Parking'],
        created_by: agentId,
        assigned_agent_id: agentId,
        // Agents can NEVER publish directly: either draft or under_review
        status: submitForReview ? 'under_review' : 'draft',
      };

      const { data, error } = await supabase.from('properties').insert(payload).select().single();

      if (error) {
        throw new Error(error.message);
      }

      setIsUploading(false);
      Alert.alert(
        submitForReview ? 'Submitted for Review' : 'Draft Saved',
        submitForReview
          ? 'Your listing has been submitted to the Admin team for review and approval.'
          : 'Property draft has been securely saved to your workspace.',
        [{ text: 'OK', onPress: onSuccess }]
      );
    } catch (err: any) {
      setIsUploading(false);
      Alert.alert('Upload Failed', err?.message || 'Failed to save property to Supabase.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.headerTitle}>Add New Property</Text>
      <Text style={styles.headerSubtitle}>
        Fill in verified specifications and upload media. Listings require administrative approval before public display.
      </Text>

      {/* Basic Info */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Property Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. 3 BHK Luxury Apartment in ATS Nobility"
          placeholderTextColor="#64748B"
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.half]}>
          <Text style={styles.label}>Listing Type</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, listingType === 'sale' && styles.toggleBtnActive]}
              onPress={() => setListingType('sale')}
            >
              <Text style={[styles.toggleText, listingType === 'sale' && styles.toggleTextActive]}>
                For Sale
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, listingType === 'rent' && styles.toggleBtnActive]}
              onPress={() => setListingType('rent')}
            >
              <Text style={[styles.toggleText, listingType === 'rent' && styles.toggleTextActive]}>
                For Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.inputGroup, styles.half]}>
          <Text style={styles.label}>Property Type</Text>
          <TextInput
            style={styles.input}
            value={propertyType}
            onChangeText={setPropertyType}
            placeholder="Apartment, Villa, Plot"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      <View style={styles.row}>
        {listingType === 'sale' ? (
          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>Total Price (₹) *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 12500000"
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>
        ) : (
          <View style={[styles.inputGroup, styles.half]}>
            <Text style={styles.label}>Monthly Rent (₹) *</Text>
            <TextInput
              style={styles.input}
              value={rent}
              onChangeText={setRent}
              placeholder="e.g. 45000"
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>
        )}

        <View style={[styles.inputGroup, styles.half]}>
          <Text style={styles.label}>Area (Sq.Ft.) *</Text>
          <TextInput
            style={styles.input}
            value={area}
            onChangeText={setArea}
            placeholder="e.g. 1520"
            keyboardType="numeric"
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.half]}>
          <Text style={styles.label}>Locality</Text>
          <TextInput
            style={styles.input}
            value={locality}
            onChangeText={setLocality}
            placeholder="e.g. Sector 4, Greater Noida West"
            placeholderTextColor="#64748B"
          />
        </View>
        <View style={[styles.inputGroup, styles.half]}>
          <Text style={styles.label}>RERA Number</Text>
          <TextInput
            style={styles.input}
            value={reraNumber}
            onChangeText={setReraNumber}
            placeholder="UPRERAPRJ..."
            placeholderTextColor="#64748B"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholder="Describe key highlights, view, connectivity, and specifications..."
          placeholderTextColor="#64748B"
        />
      </View>

      {/* Media Upload Buttons */}
      <Text style={styles.sectionHeading}>Photos & Media</Text>
      <View style={styles.mediaButtonsRow}>
        <TouchableOpacity style={styles.mediaBtn} onPress={pickImages}>
          <Text style={styles.mediaBtnText}>📸 Select Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaBtn} onPress={takePhoto}>
          <Text style={styles.mediaBtnText}>📷 Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaBtn} onPress={pickVideo}>
          <Text style={styles.mediaBtnText}>🎥 Pick Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mediaBtn} onPress={pickDocument}>
          <Text style={styles.mediaBtnText}>📄 Add Doc</Text>
        </TouchableOpacity>
      </View>

      {/* Thumbnails list */}
      {images.length > 0 && (
        <ScrollView horizontal style={styles.imageScroll}>
          {images.map((uri, index) => (
            <View key={index} style={styles.thumbWrapper}>
              <Image source={{ uri }} style={styles.thumbnail} />
              <TouchableOpacity
                style={styles.removeThumb}
                onPress={() => setImages((prev) => prev.filter((_, i) => i !== index))}
              >
                <Text style={styles.removeThumbText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {documents.length > 0 && (
        <View style={styles.docList}>
          {documents.map((doc, idx) => (
            <Text key={idx} style={styles.docItem}>
              📎 {doc.name}
            </Text>
          ))}
        </View>
      )}

      {/* Progress & Submit Action Buttons */}
      {isUploading ? (
        <View style={styles.uploadingBox}>
          <ActivityIndicator size="small" color="#E5B842" />
          <Text style={styles.uploadingText}>{uploadProgress}</Text>
        </View>
      ) : (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.draftBtn}
            onPress={() => handleSave(false)}
          >
            <Text style={styles.draftBtnText}>Save Draft</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => handleSave(true)}
          >
            <Text style={styles.submitBtnText}>Submit for Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D1A',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#0F1D38',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    color: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9,
  },
  toggleBtnActive: {
    backgroundColor: '#E5B842',
  },
  toggleText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#070D1A',
  },
  sectionHeading: {
    color: '#E5B842',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  mediaButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  mediaBtn: {
    backgroundColor: '#0F1D38',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.3)',
  },
  mediaBtnText: {
    color: '#E5B842',
    fontSize: 12,
    fontWeight: '600',
  },
  imageScroll: {
    marginBottom: 16,
  },
  thumbWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeThumb: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeThumbText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  docList: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#0F1D38',
    borderRadius: 8,
  },
  docItem: {
    color: '#94A3B8',
    fontSize: 12,
    marginVertical: 2,
  },
  uploadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    marginTop: 10,
  },
  uploadingText: {
    color: '#E5B842',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#1E293B',
  },
  cancelBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  draftBtn: {
    flex: 1.2,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0F1D38',
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.4)',
  },
  draftBtnText: {
    color: '#E5B842',
    fontSize: 13,
    fontWeight: 'bold',
  },
  submitBtn: {
    flex: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#E5B842',
  },
  submitBtnText: {
    color: '#070D1A',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
