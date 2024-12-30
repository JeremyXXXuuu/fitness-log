import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import { CircularProgress } from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
  Calendar,
} from "react-native-calendars";

type FoodEntry = {
  id: string;
  name: string;
  calories: number;
  date: string;
};

const mockEntries: FoodEntry[] = [
  { id: "1", name: "Banana", calories: 105, date: "2024-01-20" },
  { id: "2", name: "Greek Yogurt", calories: 130, date: "2024-01-20" },
  { id: "3", name: "Chicken Salad", calories: 350, date: "2024-01-20" },
];

export default function HomeScreen() {
  const [cal, setCal] = useState(0);
  const todayTotal = mockEntries.reduce(
    (sum, entry) => sum + entry.calories,
    0,
  );
  const calorieGoal = 2000; // This will come from user settings later

  return (
    <View className="h-full">
      <ExpandableCalendarScreen />
      {/* <View className="flex-row">
        <CircularProgress
          name="Calories"
          goal={2000}
          current={cal}
        />
        <CircularProgress
          name="Carbs"
          goal={2000}
          current={cal}
        />
        <CircularProgress
          name="Protein"
          goal={2000}
          current={cal}
        />
        <CircularProgress
          name="Fat"
          goal={2000}
          current={cal}
        />
      </View>

      <Button onPress={() => setCal(cal + 100)}>
        <Text>add</Text>
      </Button>
      <Button onPress={() => setCal(cal - 100)}>
        <Text>-</Text>
      </Button> */}
    </View>
  );
}

const ExpandableCalendarScreen = () => {
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  return (
    <View className="h-full">
      <View className="items-end pr-4 pt-2">
        <Button
          onPress={() => setIsCalendarExpanded(!isCalendarExpanded)}
          className="p-2"
        >
          <Text>{isCalendarExpanded ? "▼" : "▲"}</Text>
        </Button>
      </View>

      <CalendarProvider
        showTodayButton
        onDateChanged={date => console.log("onDateChanged", date)}
        // Initial date in 'yyyy-MM-dd' format
        date={new Date().toISOString().split("T")[0]}
      >
        {isCalendarExpanded ? <WeekCalendar /> : <Calendar />}
      </CalendarProvider>
    </View>
  );
};
