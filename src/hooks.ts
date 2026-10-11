import React from 'react';

export const useLocalStorage = <T,>(
    key: string,
    initialValue: T,
    isValid: (value: T) => boolean = () => true,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            const parsed = item ? (JSON.parse(item) as T) : initialValue;
            return isValid(parsed) ? parsed : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            if (valueToStore === 'system') {
                window.localStorage.removeItem(key);
            } else {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
};
