import WorkoutLog from "@/components/core/fitness/WorkoutLog";
import { Link, router } from "expo-router";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Modal() {
  const isPresented = router.canGoBack();

  return (
    <GestureHandlerRootView
      className="h-full"
      style={styles.container}
    >
      <WorkoutLog />
      {!isPresented && <Link href="../">Dismiss modal</Link>}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
