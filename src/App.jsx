import React from 'react';
import { ObraProvider } from './context/ObraContext';
import { AuthLayout } from './components/AuthLayout';

export default function App() {
  return (
    <ObraProvider>
      <AuthLayout />
    </ObraProvider>
  );
}
