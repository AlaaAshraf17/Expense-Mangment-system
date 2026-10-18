import { createContext, useContext, useEffect, useState } from 'react';

export const SETTINGS_STORAGE_KEY = 'spendly_preferences';
const DEFAULT_PREFERENCES = { currency: 'USD', dateFormat: 'MM/DD/YYYY' };
const CURRENCIES = ['USD', 'EUR', 'GBP', 'EGP'];
const DATE_FORMATS = ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'];

const loadPreferences = () => {
  try {
    const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved === null) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(saved);
    return {
      currency: CURRENCIES.includes(parsed.currency) ? parsed.currency : DEFAULT_PREFERENCES.currency,
      dateFormat: DATE_FORMATS.includes(parsed.dateFormat) ? parsed.dateFormat : DEFAULT_PREFERENCES.dateFormat,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [preferences, setPreferences] = useState(loadPreferences);

  useEffect(() => {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Keep preferences available for this session if localStorage is unavailable.
    }
  }, [preferences]);

  return (
    <SettingsContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </SettingsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
}
