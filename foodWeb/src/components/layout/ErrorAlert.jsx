import React, { useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ERROR_TIMEOUT } from '../../utils/constants';

export const ErrorAlert = ({ message, onClear }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, ERROR_TIMEOUT);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <Alert variant="destructive" className="mt-4 animate-in fade-in slide-in-from-top-2">
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
