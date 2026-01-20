import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CharacterProvider, useCharacter } from './src/context/CharacterContext';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ConversationInputScreen from './src/screens/ConversationInputScreen';
import AnalysisResultScreen from './src/screens/AnalysisResultScreen';
import { AnalysisResult } from './src/types/analysis';

type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Conversation: undefined;
  Analysis: { analysis: AnalysisResult; conversation: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const FlowNavigator = () => {
  const { character, loadCharacter } = useCharacter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await loadCharacter();
      setReady(true);
    };

    init();
  }, [loadCharacter]);

  if (!ready) {
    return <SplashScreen onContinue={() => undefined} />;
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
              onContinue={() =>
                props.navigation.replace(character ? 'Conversation' : 'Onboarding')
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Onboarding">
          {(props) => <OnboardingScreen onDone={() => props.navigation.replace('Conversation')} />}
        </Stack.Screen>
        <Stack.Screen name="Conversation">
          {(props) => (
            <ConversationInputScreen
              onAnalysisReady={(analysis, conversation) =>
                props.navigation.navigate('Analysis', { analysis, conversation })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Analysis">
          {(props) => (
            <AnalysisResultScreen
              analysis={props.route.params.analysis}
              conversation={props.route.params.conversation}
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
    <CharacterProvider>
      <FlowNavigator />
    </CharacterProvider>
  );
}
