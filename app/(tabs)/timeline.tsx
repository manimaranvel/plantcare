// TimelineScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { getMoments, getGoals, getPlants } from '../../utils/database';

const COLORS = {
  primary: '#4CAF50',
  light: '#E8F5E9',
};

/** Replace `any` here with your real Plant/Moment/Goal types */
interface Plant {
  id: string;
  name: string;
  // add other plant fields as needed
}

interface MomentItem {
  id: string;
  date: string; // ISO string in DB
  image?: string | null;
  caption?: string | null;
  // other moment fields...
}

// keep GoalItem.completed typed as boolean
interface GoalItem {
  id: string;
  target_date?: string | null;
  title: string;
  description?: string | null;
  completed?: boolean;
}

type TimelineItem =
  | {
      type: 'moment';
      id: string;
      date: Date;
      plant: Plant;
      data: MomentItem;
    }
  | {
      type: 'goal';
      id: string;
      date: Date;
      plant: Plant;
      data: GoalItem;
    };

export default function TimelineScreen() {
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadTimeline();
  }, []);

  const loadTimeline = async () => {
    try {
      setLoading(true);
      const plants: Plant[] = await getPlants(); // ensure getPlants returns Plant[]
      const allEvents: TimelineItem[] = [];

    //   for (const plant of plants) {
    //     const moments: MomentItem[] = await getMoments(plant.id);
    //     const goals: GoalItem[] = await getGoals(plant.id);

    //     moments.forEach((moment) => {
    //       allEvents.push({
    //         type: 'moment',
    //         id: moment.id,
    //         date: parseISO(moment.date),
    //         plant,
    //         data: moment,
    //       });
    //     });

    //     goals.forEach((goal) => {
    //       allEvents.push({
    //         type: 'goal',
    //         id: goal.id,
    //         date: parseISO(goal.target_date ?? new Date().toISOString()),
    //         plant,
    //         data: goal,
    //       });
    //     });
    //   }

    for (const plant of plants) {
    const moments: MomentItem[] = await getMoments(plant.id);
    const rawGoals = await getGoals(plant.id); // rawGoals may have completed as number

    moments.forEach((moment) => {
        allEvents.push({
        type: 'moment',
        id: moment.id,
        date: parseISO(moment.date),
        plant,
        data: moment,
        });
    });

    // normalize goals before pushing
    rawGoals.forEach((g) => {
        const normalized: GoalItem = {
        ...g,
        // convert numeric completed (0 | 1) to boolean true/false
        // If your DB uses other truthy values, adapt accordingly
        completed: typeof g.completed === 'number' ? g.completed === 1 : !!g.completed,
        };

        allEvents.push({
        type: 'goal',
        id: normalized.id,
        date: parseISO(normalized.target_date ?? new Date().toISOString()),
        plant,
        data: normalized,
        });
    });
    }


      const sorted = allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
      setTimelineData(sorted); // now typed correctly
    } catch (error) {
      console.error('Error loading timeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const TimelineEvent: React.FC<{ event: TimelineItem }> = ({ event }) => {
    // shared fields available on both union members
    const plantName = event.plant?.name ?? 'Unknown plant';

    if (event.type === 'moment') {
      const imgUri = event.data?.image ?? null;
      return (
        <View style={styles.eventCard}>
          <View style={styles.eventDot} />
          <View style={styles.eventContent}>
            <Text style={styles.eventPlant}>{plantName}</Text>
            {imgUri ? (
              <Image source={{ uri: imgUri }} style={styles.momentImage} />
            ) : null}
            {event.data.caption ? (
              <Text style={styles.eventCaption}>{event.data.caption}</Text>
            ) : null}
            <Text style={styles.eventDate}>{format(event.date, 'PPP p')}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.eventCard}>
          <View style={[styles.eventDot, styles.goalDot]} />
          <View style={styles.eventContent}>
            <Text style={styles.eventPlant}>{plantName}</Text>
            <Text style={styles.goalTitle}>🎯 {event.data.title}</Text>
            {event.data.description ? (
              <Text style={styles.eventCaption}>{event.data.description}</Text>
            ) : null}
            <Text style={styles.eventDate}>
              {event.data.completed ? '✓ Completed' : `Target: ${format(event.date, 'PPP')}`}
            </Text>
          </View>
        </View>
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading timeline...</Text>
      </View>
    );
  }

  if (timelineData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No timeline events yet</Text>
          <Text style={styles.emptySubtext}>Add moments and goals to your plants</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={timelineData}
        renderItem={({ item }) => <TimelineEvent event={item} />}
        keyExtractor={(item) => String(item.id)} // ensure a string key
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingText: { fontSize: 16, color: COLORS.primary, textAlign: 'center', marginTop: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  emptySubtext: { fontSize: 14, color: '#999', marginTop: 8 },
  eventCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    marginRight: 12,
    marginTop: 6,
  },
  goalDot: { backgroundColor: '#FF9800' },
  eventContent: { flex: 1 },
  eventPlant: { fontSize: 12, color: '#999', fontWeight: '600', marginBottom: 4 },
  eventCaption: { fontSize: 14, color: '#333', marginVertical: 8 },
  goalTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  momentImage: { width: '100%', height: 200, borderRadius: 8, marginVertical: 8 },
  eventDate: { fontSize: 12, color: '#999', marginTop: 8 },
});
