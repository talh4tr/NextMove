import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleProvider, useStyle } from './src/context/StyleContext';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ConversationInputScreen from './src/screens/ConversationInputScreen';
import ReplyResultScreen from './src/screens/ReplyResultScreen';
import { ReplyResult } from './src/types/reply';
import { getOnboardingSeen, setOnboardingSeen } from './src/utils/storage';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Conversation: undefined;
  Result: { result: ReplyResult };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FlowNavigator = () => {
  const { loadStyle } = useStyle();
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadStyle();
      const seen = await getOnboardingSeen();
      setShowOnboarding(!seen);
      setReady(true);
    };

    init();
  }, [loadStyle]);

  if (!ready) {
    return <SplashScreen isLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B0B0B' }
        }}
      >
        <Stack.Screen name="Splash">
          {(props) => (
            <SplashScreen
              autoContinue
              onContinue={() => {
                props.navigation.replace(showOnboarding ? 'Onboarding' : 'Conversation');
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Onboarding">
          {(props) => (
            <OnboardingScreen
              onDone={async () => {
                await setOnboardingSeen();
                setShowOnboarding(false);
                props.navigation.replace('Conversation');
              }}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Conversation">
          {(props) => (
            <ConversationInputScreen
              onReplyReady={(result) => props.navigation.navigate('Result', { result })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Result">
          {(props) => (
            <ReplyResultScreen
              result={props.route.params.result}
              onRegenerate={(nextResult) =>
                props.navigation.setParams({ result: nextResult })
              }
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <StyleProvider>
      <FlowNavigator />
    </StyleProvider>
  );
}
