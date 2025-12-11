import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { sanitize } from '../../utils/sanitize';
import { getPlantsPaginated, getPlantsCount } from '../../utils/database';
import { useDatabase } from '../../contexts/DatabaseContext';

const COLORS = {
  primary: '#4CAF50',
  light: '#E8F5E9',
  dark: '#2E7D32',
  background: '#E0F7FA',
  warning: '#FF9800',
};

const PAGE_SIZE = 20;

export default function PlantsScreen() {
  const navigation = useNavigation<any>();
  const { plants } = useDatabase();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const categories = [
    { id: 'all', label: 'All Plants', icon: 'list' },
    { id: 'garden', label: 'My Garden', icon: 'local-florist' },
    { id: 'indoor', label: 'Indoor Plant', icon: 'home' },
  ];

  const filteredPlants = plants.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'garden') return p.location === 'outdoor';
    if (selectedCategory === 'indoor') return p.location === 'indoor';
    return true;
  });

  const loadPlants = async (reset = false) => {
    const offset = reset ? 0 : page * PAGE_SIZE;
    const data = await getPlantsPaginated(offset, PAGE_SIZE);
    // setPlants(reset ? data : [...plants, ...data]);
    setPage(reset ? 1 : page + 1);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // await loadPlants(true);
    const count = await getPlantsCount();
    setTotalCount(count);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  const handleLoadMore = async () => {
    if (plants.length < totalCount) {
      await loadPlants();
    }
  };

  const PlantItem = ({ plant }: { plant: any }) => (
    <TouchableOpacity style={styles.plantCard} onPress={() => navigation.navigate('PlantDetails', { id: plant.id })}>
      <Image source={plant.image_thumb ? { uri: plant.image_thumb } : require('../../assets/placeholder.png')} style={styles.plantImage} />
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{plant.name}</Text>
        <Text style={styles.plantSpecies}>{plant.species}</Text>
        <Text style={styles.waterFrequency}>
          💧 Water every {plant.watering_frequency} days
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  if (plants.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {/* Hamburger menu */}
        <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <MaterialIcons name="local-florist" size={64} color={COLORS.primary} />
        <Text style={styles.emptyTitle}>No plants yet</Text>
        <Text style={styles.emptyDescription}>Add your first plant to get started</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddPlant')}>
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Plant</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryButton,
              selectedCategory === cat.id && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <MaterialIcons
              name={cat.icon}
              size={18}
              color={selectedCategory === cat.id ? '#fff' : COLORS.primary}
            />
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === cat.id && styles.categoryLabelActive,
              ]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Plants Grid */}
      <FlatList
        data={filteredPlants}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.plantCard}
            onPress={() => navigation.navigate('PlantDetails', { id: item.id })}
          >
            {item.image_thumb ? (
              <Image source={{ uri: item.image_thumb }} style={styles.plantImage} />
            ) : (
              <View style={[styles.plantImage, styles.plantImagePlaceholder]}>
                <MaterialIcons name="leaf" size={40} color={COLORS.primary} />
              </View>
            )}
            <Text style={styles.plantName}>{item.name}</Text>
            <Text style={styles.plantSpecies}>{item.species}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gridContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddPlant')}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: COLORS.warning,
    borderColor: COLORS.warning,
  },
  categoryLabel: {
    marginLeft: 6,
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  plantCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  plantImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.light,
  },
  plantImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  plantSpecies: {
    fontSize: 11,
    color: '#999',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  gridContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 16 },
  emptyDescription: { fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center' },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  addButtonText: { color: '#fff', marginLeft: 8, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  menuButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 2,
  },
});
