import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type FeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "selection"
  | "success"
  | "warning"
  | "error";

const createHapticHandler = (type: Haptics.ImpactFeedbackStyle) => {
  return Platform.OS === "web" ? undefined : () => Haptics.impactAsync(type);
};

const createNotificationFeedback = (type: Haptics.NotificationFeedbackType) => {
  return Platform.OS === "web"
    ? undefined
    : () => Haptics.notificationAsync(type);
};

const hapticHandlers = {
  light: createHapticHandler(Haptics.ImpactFeedbackStyle.Light),
  medium: createHapticHandler(Haptics.ImpactFeedbackStyle.Medium),
  heavy: createHapticHandler(Haptics.ImpactFeedbackStyle.Heavy),
  selection: Platform.OS === "web" ? undefined : Haptics.selectionAsync,
  success: createNotificationFeedback(Haptics.NotificationFeedbackType.Success),
  warning: createNotificationFeedback(Haptics.NotificationFeedbackType.Warning),
  error: createNotificationFeedback(Haptics.NotificationFeedbackType.Error),
};

export const useHaptic = (feedbackType: FeedbackType = "selection") => {
  return hapticHandlers[feedbackType];
};
