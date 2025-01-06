import { View } from "react-native";
import { Tabs } from "expo-router";
import { WorkoutButton } from "@/components/WorkoutBtn";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="workout-btn"
        options={{
          title: "",
          tabBarButton: () => (
            <View style={{ marginTop: -20 }}>
              <WorkoutButton />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="user-setting"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
