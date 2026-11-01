import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { CustomerNavigator } from './src/navigation/CustomerNavigator';
import { AgentNavigator } from './src/navigation/AgentNavigator';

export default function App() {
  const [appMode, setAppMode] = useState<'customer' | 'agent'>('customer');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070D1A" />
      {appMode === 'customer' ? (
        <CustomerNavigator onSwitchToAgent={() => setAppMode('agent')} />
      ) : (
        <AgentNavigator onSwitchToCustomer={() => setAppMode('customer')} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D1A',
  },
});
