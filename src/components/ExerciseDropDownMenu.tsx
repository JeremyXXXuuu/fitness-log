import * as React from "react";
import Animated, { FadeIn } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";

interface ExerciseDropDownMenuProps {
  exerciseId: string;
  onDelete: (id: string) => void;
  onReplace: () => void;
}

export function ExerciseDropDownMenu({
  exerciseId,
  onDelete,
  onReplace,
}: ExerciseDropDownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-10"
          variant="outline"
        >
          <Text>...</Text>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        // insets={contentInsets}
        className="w-64 native:w-64 bg-input"
      >
        {/* <DropdownMenuLabel>ExerciseDropDownMenu</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>add notes</Text>
          </DropdownMenuItem>
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Text>Invite users</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <Animated.View entering={FadeIn.duration(200)}>
                <DropdownMenuItem>
                  <Text>Email</Text>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Text>Message</Text>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Text>More...</Text>
                </DropdownMenuItem>s
              </Animated.View>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => onDelete(exerciseId)}>
          <Text>Delete Exercise</Text>
        </DropdownMenuItem>
        <DropdownMenuItem
          onPress={() => {
            console.log("Dropdown replace clicked");
            onReplace();
          }}
        >
          <Text>Replace Exercise</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
