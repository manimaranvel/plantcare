import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { searchPlants } from '../../utils/database';
import { useNavigation } from '@react-navigation/native';

const COLORS = {
  primary: '#4CAF50',
  light: '#E8F5E9',
};

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 0) {
      setIsSearching(true);
      try {
        const plants = await searchPlants(text);
        setResults(plants);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setResults([]);
    }
  };

  const PlantResult = ({ plant }: { plant: any }) => (
    <TouchableOpacity style={styles.resultCard} onPress={() => navigation.navigate('PlantDetails', { id: plant.id })}>
      <Image source={plant.image_thumb ? { uri: plant.image_thumb } : require('../../assets/placeholder.png')} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{plant.name}</Text>
        <Text style={styles.resultSpecies}>{plant.species}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or species..."
          value={query}
          onChangeText={handleSearch}
          placeholderTextColor="#ccc"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="close" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {query.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="search" size={64} color={COLORS.primary} />
          <Text style={styles.emptyText}>Search for plants by name or species</Text>
        </View>
      ) : isSearching ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No plants found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => <PlantResult plant={item} />}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 14,
    color: '#333',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, color: '#999', marginTop: 12, textAlign: 'center' },
  loadingText: { fontSize: 16, color: COLORS.primary },
  resultCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resultImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  resultSpecies: { fontSize: 12, color: '#999', marginTop: 2 },
});
