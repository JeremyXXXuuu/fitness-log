import { View, Text, SafeAreaView, ScrollView, Animated } from "react-native";
import { Link } from "expo-router";
import { CircularProgress } from "@/components/CircularProgress";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
  Calendar,
  CalendarList,
} from "react-native-calendars";

interface AgendaItem {
  title: string;
  data: Array<{
    hour: string;
    duration: string;
    activity: string;
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

console.log("dates", dates[0]);

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

  const renderItem = ({ item }: { item: AgendaItem["data"][0] }) => {
    return (
      <View className="flex-row p-4 bg-white mb-2 rounded-lg mx-4">
        <View className="flex-1">
          <Text className="font-bold">{item.activity}</Text>
          <Text className="text-gray-600">{item.hour}</Text>
        </View>
        <Text className="text-gray-600">{item.duration}</Text>
      </View>
    );
  };

  return (
    <View className="h-full">
      <View className="items-end pr-4">
        <Button
          onPress={() => setIsCalendarExpanded(!isCalendarExpanded)}
          variant="secondary"
          className="p-2"
          size="default"
        >
          <Text>{isCalendarExpanded ? "▼" : "▲"}</Text>
        </Button>
      </View>

      <CalendarProvider
        showTodayButton
        onDateChanged={date => console.log("onDateChanged", date)}
        date={new Date().toISOString().split("T")[0]}
      >
        {isCalendarExpanded ? <WeekCalendar /> : <Calendar />}
        <AgendaList
          sections={Object.values(mockItems)}
          renderItem={renderItem}
          sectionStyle={{
            backgroundColor: "#f2f2f2",
            padding: 10,
            marginBottom: 8,
          }}
        />
      </CalendarProvider>
    </View>
  );
};
