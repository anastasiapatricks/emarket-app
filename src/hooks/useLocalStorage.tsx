import { useEffect, useState } from 'react';

// Define a generic type for the data you want to store in localStorage
type LocalStorageValue<T> = [T | null, (value: T | null) => void];

function useLocalStorage<T>(key: string, initialValue: T | null): LocalStorageValue<T> {
  // Read the initial value from localStorage if it exists
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // Create a state variable to store the current value
  const [value, setValue] = useState<T | null>(initial);

  // Update localStorage whenever the value changes
  useEffect(() => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;