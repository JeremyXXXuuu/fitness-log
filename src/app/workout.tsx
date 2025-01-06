import WorkoutLog from "@/components/core/fitness/WorkoutLog";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "@/components/ui/keyboardProvider";
import { PortalHost } from "@rn-primitives/portal";

export default function Modal() {
  const isPresented = router.canGoBack();

  return (
    <KeyboardProvider>
      <GestureHandlerRootView
        className="h-full"
        style={styles.container}
      >
        <WorkoutLog />
        {!isPresented && <Link href="../">Minimize Workout</Link>}
      </GestureHandlerRootView>
      <PortalHost />
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
