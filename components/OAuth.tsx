import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

// OAuth component for Google sign-in using Clerk and OAuth
const OAuth = () => {
  // The useOAuth hook is used to start the OAuth flow with the specified strategy
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // The handleGoogleSignIn function is used to handle the Google sign-in flow
  const handleGoogleSignIn = async () => {
    // The googleOAuth function is used to start the Google OAuth flow
    const result = await googleOAuth(startOAuthFlow);

    // If the result code is "session_exists", redirect to the home screen
    if (result.code === "session_exists") {
      Alert.alert("Success", "Session exists. Redirecting to home screen.");
      router.replace("/(root)/(tabs)/home");
    }

    // Show an alert with the result message
    Alert.alert(result.success ? "Success" : "Error", result.message);
  };

  // Render the OAuth component with the Google sign-in button
  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-general-100" />
        <Text className="text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-general-100" />
      </View>

      <CustomButton
        title="Log In with Google"
        className="mt-5 w-full shadow-none"
        IconLeft={() => (
          <Image
            source={icons.google}
            resizeMode="contain"
            className="w-5 h-5 mx-2"
          />
        )}
        bgVariant="outline"
        textVariant="primary"
        onPress={handleGoogleSignIn}
      />
    </View>
  );
};

export default OAuth;
