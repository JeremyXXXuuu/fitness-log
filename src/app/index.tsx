import { View } from "react-native";
import { useEffect, useState } from "react";
import { getDrizzle } from "@/db/db";
import { UserService } from "@/db/user";
import type { usersTable } from "@/db/schema";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "drizzle/migrations";

import { Text } from "@/components/ui/text";
import { supabase } from "@/lib/supabase";
import Auth from "@/components/auth/Auth";
import Account from "@/components/auth/Account";

import { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

// const expo = SQLite.openDatabaseSync("db.db", { enableChangeListener: true });

// const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(getDrizzle(), migrations);
  const [items, setItems] = useState<(typeof usersTable.$inferSelect)[] | null>(
    null,
  );

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  useEffect(() => {
    if (!success) return;

    const initializeData = async () => {
      try {
        await UserService.deleteAllUsers();
        await UserService.createUser({
          name: "John",
          age: 30,
          email: "john@example111.com",
        });
        await UserService.setCaloriesGoal(1, 2000);
        await UserService.setMacrosGoal(1, {
          fat: 50,
          protein: 100,
          carbs: 200,
        });
        const users = await UserService.getAllUsers();
        setItems(users);
      } catch (err) {
        console.error("Database operation failed:", err);
      }
    };

    initializeData();
  }, [success]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  if (items === null || items.length === 0) {
    return (
      <View>
        <Text>Empty</Text>
      </View>
    );
  }

  return (
    <View>
      {items.map(item => (
        <View key={item.id}>
          <Text>{item.id}</Text>
          <Text>{item.email}</Text>
          <Text>{item.calorires_goal}</Text>
          <Button>
            <Text>Update</Text>
          </Button>
        </View>
      ))}
      {session && session.user ? (
        <Account
          key={session.user.id}
          session={session}
        />
      ) : (
        <Auth />
      )}
    </View>
  );
}
