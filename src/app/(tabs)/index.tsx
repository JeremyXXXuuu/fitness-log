import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useFocusEffect } from "expo-router";
import { CircularProgress } from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, useCallback } from "react";
import { WorkoutLogService } from "@/db/workout_log";
import { workoutLog } from "@/db/types";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
  Calendar,
  CalendarList,
} from "react-native-calendars";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { WorkoutLogModal } from "@/components/core/fitness/WorkoutLogModal";

interface AgendaItem {
  title: string;
  data: Array<{
    hour: string;
    duration: string;
    activity: string;
  }>;
}

interface WorkoutAgendaItem {
  title: string;
  data: Array<{
    hour: string;
    duration: string;
    activity: string;
    id: string;
  }>;
}

const today = new Date().toISOString().split("T")[0];
const fastDate = getPastDate(3);
const futureDates = getFutureDates(12);
const dates = [fastDate, today].concat(futureDates);

function getFutureDates(numberOfDays: number) {
  const array: string[] = [];
  for (let index = 1; index <= numberOfDays; index++) {
    let d = Date.now();
    if (index > 8) {
      // set dates on the next month
      const newMonth = new Date(d).getMonth() + 1;
      d = new Date(d).setMonth(newMonth);
    }
    const date = new Date(d + 864e5 * index); // 864e5 == 86400000 == 24*60*60*1000
    const dateString = date.toISOString().split("T")[0];
    array.push(dateString);
  }
  return array;
}
function getPastDate(numberOfDays: number) {
  return new Date(Date.now() - 864e5 * numberOfDays)
    .toISOString()
    .split("T")[0];
}

const mockItems: { [key: string]: AgendaItem } = {
  [dates[0]]: {
    title: dates[0],
    data: [
      { hour: "09:00", duration: "1h", activity: "Morning Run" },
      { hour: "15:00", duration: "45m", activity: "Weight Training" },
    ],
  },
  [dates[1]]: {
    title: dates[1],
    data: [
      { hour: "10:00", duration: "30m", activity: "Yoga" },
      { hour: "16:00", duration: "1h", activity: "Swimming" },
    ],
  },
  [dates[2]]: {
    title: dates[2],
    data: [
      { hour: "09:00", duration: "1h", activity: "Morning Run" },
      { hour: "15:00", duration: "45m", activity: "Weight Training" },
    ],
  },
  [dates[3]]: {
    title: dates[3],
    data: [
      { hour: "10:00", duration: "30m", activity: "Yoga" },
      { hour: "16:00", duration: "1h", activity: "Swimming" },
    ],
  },
  [dates[4]]: {
    title: dates[4],
    data: [
      { hour: "09:00", duration: "1h", activity: "Morning Run" },
      { hour: "15:00", duration: "45m", activity: "Weight Training" },
    ],
  },
  [dates[5]]: {
    title: dates[5],
    data: [
      { hour: "10:00", duration: "30m", activity: "Yoga" },
      { hour: "16:00", duration: "1h", activity: "Swimming" },
    ],
  },
  [dates[6]]: {
    title: dates[6],
    data: [
      { hour: "09:00", duration: "1h", activity: "Morning Run" },
      { hour: "15:00", duration: "45m", activity: "Weight Training" },
    ],
  },
  [dates[7]]: {
    title: dates[7],
    data: [
      { hour: "10:00", duration: "30m", activity: "Yoga" },
      { hour: "16:00", duration: "1h", activity: "Swimming" },
    ],
  },
  [dates[8]]: {
    title: dates[8],
    data: [
      { hour: "09:00", duration: "1h", activity: "Morning Run" },
      { hour: "15:00", duration: "45m", activity: "Weight Training" },
    ],
  },
  [dates[9]]: {
    title: dates[9],
    data: [
      { hour: "10:00", duration: "30m", activity: "Yoga" },
      { hour: "16:00", duration: "1h", activity: "Swimming" },
    ],
  },
  // Add more dates as needed
};

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ExpandableCalendarScreen />
    </SafeAreaView>
  );
}

const ExpandableCalendarScreen = () => {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const { isDarkColorScheme } = useColorScheme();
  const theme = isDarkColorScheme ? NAV_THEME.dark : NAV_THEME.light;

  const calendarKey = `calendar-${isDarkColorScheme}`;

  const [workoutLogs, setWorkoutLogs] = useState<{
    [key: string]: WorkoutAgendaItem;
  }>({});

  const loadWorkoutLogsCallback = useCallback(() => {
    loadWorkoutLogs();
  }, []);

  useFocusEffect(loadWorkoutLogsCallback);

  const loadWorkoutLogs = async () => {
    const logs = await WorkoutLogService.getAllWorkoutLogs();
    const formattedLogs = formatLogsForCalendar(logs);
    setWorkoutLogs(formattedLogs);
  };

  const formatLogsForCalendar = (logs: workoutLog[]) => {
    const formatted: { [key: string]: WorkoutAgendaItem } = {};

    logs.forEach(log => {
      const date = log.calendar_date;
      if (!formatted[date]) {
        formatted[date] = {
          title: date,
          data: [],
        };
      }

      formatted[date].data.push({
        hour: new Date(log.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        duration: `${Math.floor(log.duration / 60)}m`,
        activity: log.name,
        id: log.id,
      });
    });

    return formatted;
  };

  const [selectedWorkout, setSelectedWorkout] = useState<
    workoutLog | undefined
  >(undefined);

  const handleWorkoutPress = async (workoutId: string) => {
    console.log("workoutId", workoutId);
    const workout = await WorkoutLogService.getWorkoutLog(workoutId);
    setSelectedWorkout(workout);
  };

  const renderItem = ({ item }: { item: WorkoutAgendaItem["data"][0] }) => {
    return (
      <Pressable
        onPress={() => handleWorkoutPress(item.id)}
        delayLongPress={150}
        className="mx-4"
      >
        {({ pressed }) => (
          <View
            className="flex-row p-4 mb-2 rounded-lg"
            style={[
              { backgroundColor: theme.card },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View className="flex-1">
              <Text
                style={{ color: theme.text }}
                className="font-bold"
              >
                {item.activity}
              </Text>
              <Text
                style={{ color: theme.text }}
                className="text-gray-600"
              >
                {item.hour}
              </Text>
            </View>
            <Text
              style={{ color: theme.text }}
              className="text-gray-600"
            >
              {item.duration}
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View
      className="h-full"
      style={{ backgroundColor: theme.background }}
    >
      {/* <View className="items-end pr-4">
        <Button
          onPress={() => setIsCalendarExpanded(!isCalendarExpanded)}
          variant="secondary"
          className="w-10"
          size="default"
        >
          <Text style={{ color: theme.text }}>
            {isCalendarExpanded ? "▼" : "▲"}
          </Text>
        </Button>
      </View> */}

      <CalendarProvider
        showTodayButton
        onDateChanged={date => console.log("onDateChanged", date)}
        date={new Date().toISOString().split("T")[0]}
        theme={{
          calendarBackground: theme.card,
          textSectionTitleColor: theme.text,
          selectedDayBackgroundColor: theme.primary,
          selectedDayTextColor: theme.background,
          todayTextColor: theme.primary,
          dayTextColor: theme.text,
          textDisabledColor: theme.border,
          monthTextColor: theme.text,
        }}
      >
        {isCalendarExpanded ? (
          <Calendar
            key={calendarKey}
            theme={{
              calendarBackground: theme.card,
              textSectionTitleColor: theme.text,
              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: theme.background,
              todayTextColor: theme.primary,
              dayTextColor: theme.text,
              textDisabledColor: theme.border,
              monthTextColor: theme.text,
            }}
          />
        ) : (
          <WeekCalendar
            key={calendarKey}
            theme={{
              calendarBackground: theme.card,
              textSectionTitleColor: theme.text,
              selectedDayBackgroundColor: theme.primary,
              selectedDayTextColor: theme.background,
              todayTextColor: theme.primary,
              dayTextColor: theme.text,
              textDisabledColor: theme.border,
            }}
          />
        )}
        <AgendaList
          sections={Object.values(workoutLogs)}
          renderItem={renderItem}
          sectionStyle={{
            padding: 10,
            marginBottom: 8,
            backgroundColor: theme.card,
          }}
        />
      </CalendarProvider>
      <WorkoutLogModal
        workout={selectedWorkout}
        visible={!!selectedWorkout}
        onClose={() => setSelectedWorkout(undefined)}
        onDelete={loadWorkoutLogs}
      />
    </View>
  );
};
