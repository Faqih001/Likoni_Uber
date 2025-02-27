import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";

import { fetchAPI } from "@/lib/fetch";

// Token cache to store and retrieve tokens securely
export const tokenCache = {
  // Retrieve token from cache 
  async getToken(key: string) {
    // Retrieve token from cache using SecureStore API
    try {
      const item = await SecureStore.getItemAsync(key);

      // Log token retrieval status to console
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  // Save token to cache
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Google OAuth flow to sign in users with Google account
export const googleOAuth = async (startOAuthFlow: any) => {
  // Start OAuth flow to sign in users with Google account
  try {
    // Start OAuth flow to sign in users with Google account and retrieve session ID and user details
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/home"),
    });

    // If session ID is created, set active session and user details
    if (createdSessionId) {
      if (setActive) {
        await setActive({ session: createdSessionId });

        // If user details are available, create user account in the backend
        if (signUp.createdUserId) {
          await fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: `${signUp.firstName} ${signUp.lastName}`,
              email: signUp.emailAddress,
              clerkId: signUp.createdUserId,
            }),
          });
        }

        // Save session ID to cache
        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    // Return error message if an error occurred while signing in with Google
    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};
