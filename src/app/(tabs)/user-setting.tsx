import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/auth/Auth";
import Account from "@/components/auth/Account";
import { Session } from "@supabase/supabase-js";
import { Text } from "@/components/ui/text";
import { ThemeSwitch } from "@/components/theme/ThemeSwitch";
import { WorkoutExportComponent } from "@/components/workoutExportComponent";
import { Input } from "@/components/ui/input";

export default function UserSetting() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const DismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <TouchableWithoutFeedback
        onPress={() => {
          DismissKeyboard();
        }}
      >
        <View className="p-4 space-y-6 h-full w-full">
          {/* Profile Section */}
          {/* <View className="space-y-2">
          <Text className="text-lg font-semibold">Profile</Text>
          <View className="bg-card rounded-lg p-4">
            {session && session.user ? (
              <Account
                key={session.user.id}
                session={session}
              />
            ) : (
              <Auth />
            )}
          </View>
        </View> */}

          {/* Appearance Section */}
          <View className="space-y-2">
            <Text className="text-lg font-semibold">Appearance</Text>
            <View className="bg-card rounded-lg p-2 flex-row justify-between items-center">
              <Text>Theme</Text>
              <ThemeSwitch />
            </View>
          </View>

          {/* App Info Section */}
          <View className="space-y-2">
            <Text className="text-lg font-semibold">About</Text>
            <View className="bg-card rounded-lg p-4">
              <Text className="text-sm text-muted-foreground">
                Version 1.0.0
              </Text>
            </View>
          </View>

          {/* Export Data Section */}
          <View className="space-y-2">
            <Text className="text-lg font-semibold">Data</Text>
            <View className="bg-card rounded-lg p-4 space-y-2">
              {session?.user ? (
                <WorkoutExportComponent userId={session.user.id} />
              ) : (
                <View>
                  <WorkoutExportComponent userId={"1"} />
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
