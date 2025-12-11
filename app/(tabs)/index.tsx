import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDatabase } from '../../contexts/DatabaseContext';
import { format } from 'date-fns';

const COLORS = {
  primary: '#4CAF50',
  secondary: '#66BB6A',
  accent: '#81C784',
  light: '#E8F5E9',
  lightBg: '#B3E5FC',
  background: '#E0F7FA',
  warning: 'rgba(255, 153, 0, 0.88)',
  active:'#4CAF50',
};

const dashboardBg = require('../../assets/dashheroimg.png');

export default function DashboardScreen({ navigation }: any) {
  const { plants } = useDatabase();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    // Calculate tasks (plants needing watering)
    const needsWatering = plants.filter(p => {
      if (!p.last_watered_date) return true;
      const days = Math.floor((Date.now() - new Date(p.last_watered_date).getTime()) / (1000 * 60 * 60 * 24));
      return days >= p.watering_frequency;
    }).length;
    setTaskCount(needsWatering);
  }, [plants]);

  const getDaysOfWeek = () => {
    const days = [];
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getDaysOfWeek();

  return (
    <ImageBackground source={dashboardBg} style={styles.backgroundImage} resizeMode="contain" imageStyle={{top: -240, left: 0,right: 0,}}>
      <View style={styles.backgroundOverlay}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Date & Day Header */}
          
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{format(selectedDate, 'MMM dd, yyyy')}</Text>
            <Text style={styles.dayText}>{format(selectedDate, 'EEEE')}</Text>
          </View>

          {/* Week Calendar */}
          <View style={styles.calendarContainer}>
            <FlatList
              data={weekDays}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    item.toDateString() === selectedDate.toDateString() && styles.dayButtonActive,
                  ]}
                  onPress={() => setSelectedDate(item)}
                >
                  <Text style={styles.dayButtonShort}>{format(item, 'EEE').substring(0, 2)}</Text>
                  <Text style={[
                    styles.dayButtonDate,
                    item.toDateString() === selectedDate.toDateString() && styles.dayButtonDateActive,
                  ]}>
                    {format(item, 'dd')}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.toISOString()}
            />
          </View>
          {/* Decorative Flowers */}
          <View style={styles.flowersDecor} />
          
          {/* Task Overview */}
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>You have {taskCount} task</Text>
            <Text style={styles.taskSubtitle}>Today Reminder</Text>
            
            <View style={styles.taskButtons}>
              <TouchableOpacity style={styles.taskButtonAll}>
                <Icon name="list" size={16} color={COLORS.light} />
                <Text style={styles.taskButtonText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.taskButton}>
                <Icon name="opacity" size={16} color={COLORS.primary} />
                <Text style={styles.taskButtonText}>Watering</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.taskButton}>
                <Icon name="spray" size={16} color={COLORS.primary} />
                <Text style={styles.taskButtonText}>Misting</Text>
              </TouchableOpacity>
            </View>

            {/* Progress Items */}
            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Plant Watering</Text>
              <Text style={styles.progressMeta}>20 Plant need to watering</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '80%' }]} />
              </View>
              <Text style={styles.progressPercent}>80%</Text>
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Plant Misting</Text>
              <Text style={styles.progressMeta}>15 Plant need to watering</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressPercent}>60%</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
   );
 }

 const styles = StyleSheet.create({
   backgroundImage: {
     flex: 1,
     width: '100%',
     height: '100%',
     color: '#94cd99ff'
   },
   backgroundOverlay: {
     flex: 1,
    //  backgroundColor: 'rgba(255,255,255,0.7)', // translucency for readability over the hero image
   },
   container: {
     flex: 1,
     backgroundColor: 'transparent',
     paddingHorizontal: 16,
   },
   dateHeader: {
     paddingVertical: 16,
   },
   dateText: {
     fontSize: 12,
     color: '#666',
   },
   dayText: {
     fontSize: 28,
     fontWeight: 'bold',
     color: '#333',
     marginTop: 4,
   },
   calendarContainer: {
     marginVertical: 12,
   },
   dayButton: {
     backgroundColor: '#fff',
     borderRadius: 16,
     paddingVertical: 8,
     paddingHorizontal: 12,
     marginRight: 8,
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#e0e0e0',
   },
   dayButtonActive: {
     backgroundColor: COLORS.active,
     borderColor: COLORS.warning,
   },
   dayButtonShort: {
     fontSize: 10,
     color: '#f9f7f7ff',
   },
   dayButtonDate: {
     fontSize: 14,
     fontWeight: 'bold',
     color: '#333',
     marginTop: 4,
   },
   dayButtonDateActive: {
     color: '#fff',
   },
   flowersDecor: {
     height: 60,
     marginVertical: 8,
   },
   taskCard: {
     backgroundColor: '#fff',
     borderRadius: 20,
     padding: 16,
     marginBottom: 20,
   },
   taskTitle: {
     fontSize: 16,
     fontWeight: 'bold',
     color: '#333',
   },
   taskSubtitle: {
     fontSize: 12,
     color: '#999',
     marginTop: 2,
   },
   taskButtons: {
     flexDirection: 'row',
     marginTop: 12,
     gap: 8,
   },
   taskButtonAll: {
     backgroundColor: COLORS.active,
     borderRadius: 20,
     paddingHorizontal: 16,
     paddingVertical: 8,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 4,
   },
   taskButton: {
     backgroundColor: '#f5f5f5',
     borderRadius: 20,
     paddingHorizontal: 16,
     paddingVertical: 8,
     flexDirection: 'row',
     alignItems: 'center',
     gap: 4,
   },
   taskButtonText: {
     fontSize: 12,
     color: COLORS.primary,
     fontWeight: '600',
   },
   progressItem: {
     marginTop: 16,
   },
   progressLabel: {
     fontSize: 14,
     fontWeight: '600',
     color: '#333',
   },
   progressMeta: {
     fontSize: 11,
     color: '#999',
     marginTop: 2,
   },
   progressBar: {
     height: 6,
     backgroundColor: '#e0e0e0',
     borderRadius: 3,
     marginTop: 8,
     overflow: 'hidden',
   },
   progressFill: {
     height: '100%',
     backgroundColor: '#5FC4E6',
   },
   progressPercent: {
     fontSize: 11,
     color: '#5FC4E6',
     marginTop: 4,
     fontWeight: '600',
   },
   bottomNav: {
     flexDirection: 'row',
     justifyContent: 'space-around',
     paddingVertical: 12,
   },
 });
