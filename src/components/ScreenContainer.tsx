import React from 'react';
import { SafeAreaView, StyleSheet, View, ViewProps } from 'react-native';

const ScreenContainer: React.FC<ViewProps> = ({ children, style }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B0B0B'
  },
  container: {
    flex: 1,
    padding: 24
  }
});

export default ScreenContainer;
