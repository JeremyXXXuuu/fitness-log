import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { View, Alert } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { Session } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";

interface Props {
  session: Session;
}

export default function Account({ session }: Props) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string;
    website: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View className="space-y-4">
      <View className="space-y-1">
        <Text className="text-sm text-muted-foreground">Signed in as</Text>
        <Text className="font-medium">{session.user.email}</Text>
      </View>
      <View>
        <Input
          value={username || ""}
          onChangeText={text => setUsername(text)}
        />
      </View>
      <View>
        <Input
          value={website || ""}
          onChangeText={text => setWebsite(text)}
        />
      </View>

      <View>
        <Button
          onPress={() =>
            updateProfile({ username, website, avatar_url: avatarUrl })
          }
          disabled={loading}
        >
          {loading ? <Text>Loading ...</Text> : <Text>Update</Text>}
        </Button>
      </View>

      <Button
        onPress={handleSignOut}
        variant="destructive"
      >
        <Text className="text-white">Sign Out</Text>
      </Button>
    </View>
  );
}
