import WorkoutLog from "@/components/core/fitness/WorkoutLog";
import { Link, router } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "@/components/ui/keyboardProvider";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Modal() {
  const isPresented = router.canGoBack();

  return (
    <KeyboardProvider>
      <GestureHandlerRootView
        className="h-full"
        style={styles.container}
      >
        {Platform.OS === "android" ? (
          <SafeAreaView className="h-full w-full">
            <WorkoutLog />
          </SafeAreaView>
        ) : (
          <WorkoutLog />
        )}
        {!isPresented && <Link href="../">Minimize Workout</Link>}
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
