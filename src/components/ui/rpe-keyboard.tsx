import React from "react";
import { Platform, View } from "react-native";
import { Text } from "./text";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface RPEKeyboardProps {
  onKeyPress: (key: string, value?: string) => void;
}

//6, 6,5, 7, 7,5 .... 9.5, 10 , user friendly Effort Description
const rpe_description = {
  ["6"]:
    "Light effort: Starting to feel some resistance, but still very manageable. You could maintain this pace or weight for a long time without tiring.",
  ["6.5"]:
    "Between light and moderate effort: You’re working a bit harder now, but it still feels controlled. Could do several more reps without much strain.",
  ["7"]:
    "Moderate effort: You can feel the exertion building. You could do 3–4 more reps, but it’s becoming noticeable.",
  ["7.5"]:
    "Getting tough: A solid working weight. You can still complete 2–3 more reps, but it’s requiring focus.",
  ["8"]:
    "Hard effort: It’s demanding, but doable. You could manage 2 more reps if you really pushed yourself.",
  ["8.5"]:
    "Very hard effort: You’re approaching your limit. Completing 1–2 more reps would be extremely difficult.",
  ["9"]:
    "Max effort with reserve: You’re almost at your max. Only 1 more rep is realistically possible.",
  ["9.5"]:
    "Near max effort: You’re giving it almost everything you have. You might squeeze out 1 more rep, but form or technique might start to break down slightly.",
  ["10"]:
    "Absolute maximum effort: You’ve reached your limit. No more reps are possible, and you’ve given it everything you have.",
};

const RPEKeyboard: React.FC<RPEKeyboardProps> = ({ onKeyPress }) => {
  const rpeValues = ["6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10"];
  const [rpe, setRPE] = React.useState("");
  const onSelectRPE = (value: string) => {
    setRPE(value);
    onKeyPress("rpe-input", value);
  };
  const insets = useSafeAreaInsets();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <View
      className="flex-col p-1 h-full"
      style={{ backgroundColor: "#1F2937" }}
    >
      <View className="h-28 flex-row mb-2 mt-0 justify-between">
        <View className="flex-col w-[15%] m-2 justify-center">
          {/* <Button
            className="mb-2 w-full justify-center items-center text-center self-center"
            onPress={() => onKeyPress("numbers")}
          >
            <Text> 🔙 </Text>
          </Button> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className=" w-full justify-center items-center text-center self-center">
                <Text> ℹ️ </Text>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side={Platform.OS === "web" ? "bottom" : "top"}
              insets={contentInsets}
              className="w-80"
            >
              <Text>
                RPE (Rate of Perceived Exertion) is a scale used to measure the
                intensity of your exercise. It ranges from 6 to 10, with 6 being
                very light effort and 10 being maximum effort.
              </Text>
            </PopoverContent>
          </Popover>
        </View>

        <View className="w-[84%] p-2 bg-gray-800 rounded-lg ">
          <Text className="text-sm text-gray-300">
            RPE (Rate of Perceived Exertion)
          </Text>
          <Text className="text-sm text-gray-400 mt-2">
            {rpe_description[rpe as keyof typeof rpe_description]}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-center">
        {rpeValues.map(value => (
          <Button
            key={value}
            className="w-[10%] m-0.5 justify-center items-center text-xs p-0"
            onPress={() => onSelectRPE(value)}
          >
            <Text className="p-0 m-0 text-xs">{value}</Text>
          </Button>
        ))}

        {/* <Button
          className="w-[32%] aspect-[2] m-0.5 justify-center items-center"
          onPress={() => onKeyPress("clear")}
        >
          <Text>Clear</Text>
        </Button> */}
      </View>
    </View>
  );
};

export default RPEKeyboard;
