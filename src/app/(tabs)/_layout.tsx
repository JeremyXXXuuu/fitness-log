import { View } from "react-native";
import { Tabs } from "expo-router";
import { WorkoutButton } from "@/components/WorkoutBtn";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 70,
          paddingBottom: 0,
        },
        tabBarLabel: () => null, // Hide tab bar labels
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons
              name="fitness-center"
              color={color}
              size={24}
            />
          ),
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
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="cog"
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
