import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { supabase } from "@/lib/supabase";

export default function Oauth() {
  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    webClientId:
      "384916776729-6d3hhmskrliqbf4ea9q96af2kt880mgn.apps.googleusercontent.com",
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          if (userInfo.data.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: "google",
              token: userInfo.data.idToken,
            });
            console.log(error, data);
          } else {
            throw new Error("no ID token present!");
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log("user cancelled the login flow");
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            console.log("operation (e.g. sign in) is in progress already");
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log("play services not available or outdated");
            // play services not available or outdated
          } else {
            console.log("some other error happened");
            // some other error happened
          }
        }
      }}
    />
  );
}
