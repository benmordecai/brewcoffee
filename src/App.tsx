import React from 'react';

interface RecipeFormData {
    id: string;
    name: string;
    description: string;
    ratio: number;
    suggestedGrounds: number;
    grind: string;
    waterTemperature: { value: number; unit: string; };
    pours: number;
    timeBetweenPours: { minutes: number; seconds: number; };
    comments: string;
}

interface Recipe {
    id: string;
    name: string;
    description: string;
    ratio: number;
    suggestedGrounds: number;
    grind: string;
    waterTemperature: { value: number; unit: string; };
    pours: number;
    timeBetweenPours: { minutes: number; seconds: number; };
    comments: string;
}

const initialRecipes: Recipe[] = [
    {
        id: 'default-1',
        name: 'Pour Over',
        description: 'A perfect small cup, designed for conical brewers like the Hario V60.',
        ratio: 15,
        suggestedGrounds: 15,
        grind: 'Medium',
        waterTemperature: { value: 212, unit: 'F' },
        pours: 3,
        timeBetweenPours: { minutes: 0, seconds: 35 },
        comments: 'Fold the bottom of the filter to reinforce the seal, and pre-wet the filter and mug with hot water. Place mug, brewer and moistened filter with grounds on a kitchen scale and tare to zero. Start the timer and begin the pour. Pour slowly, but it is not necessary to take the entire time. Begin the next pour when the timer has elapsed.',
    },
    {
        id: 'default-2',
        name: 'French Press',
        description: 'Hearty and silty brew for a long session. Perfect for sharing.',
        ratio: 16,
        suggestedGrounds: 60,
        grind: 'Coarse',
        waterTemperature: { value: 210, unit: 'F' },
        pours: 1,
        timeBetweenPours: { minutes: 10, seconds: 0 },
        comments: 'Remove the plunger and add grounds. Then add pour the entire amount of water. Apply the plunger just enough to submerge the grounds below the surface. Let steep for the full timer. Then plunge the grounds to the bottom of the press. Pour finished coffee into a mug.',
    },
];

const grindOptions = ['Extra Coarse', 'Coarse', 'Medium-Coarse', 'Medium', 'Medium-Fine', 'Fine', 'Very Fine'];

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = React.useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
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

import { LocalNotifications } from '@capacitor/local-notifications';

const playNotificationSound = async () => {
    console.log("Attempting to schedule notification...");
    try {
        const result = await LocalNotifications.schedule({
            notifications: [
                {
                    title: 'Timer Completed!',
                    body: 'Your timer has finished.',
                    id: 1, // Unique ID for this notification
                    channelId: 'timer_completion',
                    sound: 'default',
                    
                },
            ],
        });
        console.log("Notification scheduled result:", result);
    } catch (e) {
        console.error("Error scheduling notification:", e);
    }
};

const Icon: React.FC<{ name: string; className: string }> = ({ name, className }) => {
    const icons: { [key: string]: React.ReactElement } = {
        gear: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.48.398.668 1.03.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.644.87l-.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313-.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.331-.183.581-.495.644-.87l.213-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        home: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
            </svg>
        ),
        plus: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        ),
        trash: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09 1.02-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        ),
        edit: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
        ),
        chevronUp: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
        ),
        chevronDown: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
        )
    };
    return icons[name] || null;
};

const Header: React.FC<{ page: string; setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ page, setPage }) => {
    return (
        <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md sticky top-0 z-20">
        <h1 className="text-2xl font-heading font-bold text-gray-800 dark:text-gray-200 flex items-center">
        BrewCoffee
        </h1>
        <button
        onClick={() => setPage(page === 'main' ? 'settings' : 'main')}
        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label={page === 'main' ? 'Go to settings' : 'Go to main page'}
        >
        <Icon name={page === 'main' ? 'gear' : 'home'} className="w-8 h-8" />
        </button>
        </header>
    );
};

const Modal: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
        </div>
        </div>
    );
};

const RecipeForm: React.FC<{ recipe: RecipeFormData | null; onSave: (data: RecipeFormData) => void; onCancel: () => void }> = ({ recipe, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState<RecipeFormData>(
        recipe || {
            id: `recipe_${Date.now()}`,
            name: '',
            description: '',
            ratio: 15,
            suggestedGrounds: 20,
            grind: 'Medium',
            waterTemperature: { value: 212, unit: 'F' },
            pours: 3,
            timeBetweenPours: { minutes: 0, seconds: 30 },
            comments: '',
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: keyof RecipeFormData, child: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as Record<string, number | string>),
                [child]: value,
            },
        }));
    };

    

    const handleTimeChange = (part: keyof RecipeFormData['timeBetweenPours'], value: string) => {
        let numValue = parseInt(value, 10) || 0;
        if (numValue < 0) numValue = 0;
        if (numValue > 59) numValue = 59;
        handleNestedChange('timeBetweenPours', part, numValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-heading text-gray-800 dark:text-gray-200 mb-4">{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        
        <div className="mb-4">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        </div>

        <div className="mb-4">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Ratio (1:X)</label>
        <select name="ratio" value={String(formData.ratio)} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200">
        {Array.from({length: 11}, (_, i) => i + 10).map(n => <option key={n} value={n}>1:{n}</option>)}
        </select>
        </div>
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Suggested Grounds (g)</label>
        <input type="number" name="suggestedGrounds" value={String(formData.suggestedGrounds)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, suggestedGrounds: parseInt(e.target.value, 10) || 0})} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Grind</label>
        <select name="grind" value={formData.grind} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200">
        {grindOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        </div>
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Water Temp</label>
        <div className="flex">
        <input type="number" value={String(formData.waterTemperature.value)} onChange={(e) => handleNestedChange('waterTemperature', 'value', parseInt(e.target.value, 10) || 0)} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
        {formData.waterTemperature.unit}
        </span>
        </div>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pours</label>
        <input type="number" name="pours" value={String(formData.pours)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({...formData, pours: parseInt(e.target.value, 10) || 0})} min="1" max="10" className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        </div>
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Time Between Pours</label>
        <div className="flex items-center space-x-2">
        <input type="number" value={String(formData.timeBetweenPours.minutes)} onChange={(e) => handleTimeChange('minutes', e.target.value)} min="0" max="59" className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        <span className="text-gray-500 dark:text-gray-400">:</span>
        <input type="number" value={String(formData.timeBetweenPours.seconds).padStart(2, '0')} onChange={(e) => handleTimeChange('seconds', e.target.value)} min="0" max="59" className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        </div>
        </div>
        </div>

        <div className="mb-4">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Comments</label>
        <textarea name="comments" value={formData.comments} onChange={handleChange} rows={6} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200"></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-500 transition-colors">Cancel</button>
        <button type="submit" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-opacity font-semibold">Save Recipe</button>
        </div>
        </form>
    );
};

const SettingsPage: React.FC<{
    recipes: Recipe[];
    setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
    tempUnit: string;
    setTempUnit: React.Dispatch<React.SetStateAction<string>>;
}> = ({ recipes, setRecipes, theme, setTheme, tempUnit, setTempUnit }) => {
    const [isFormVisible, setIsFormVisible] = React.useState(false);
    const [editingRecipe, setEditingRecipe] = React.useState<RecipeFormData | null>(null);

    const handleAddRecipe = () => {
        setEditingRecipe(null);
        setIsFormVisible(true);
    };

    const handleEditRecipe = (recipe: Recipe) => {
        setEditingRecipe(recipe);
        setIsFormVisible(true);
    };

    const handleDeleteRecipe = (id: string) => {
        if (recipes.length > 1) {
            if (window.confirm('Are you sure you want to delete this recipe?')) {
                setRecipes(recipes.filter((r: Recipe) => r.id !== id));
            }
        } else {
            alert("You cannot delete the last recipe.");
        }
    };

    const handleSaveRecipe = (recipeData: RecipeFormData) => {
        const exists = recipes.some((r: Recipe) => r.id === recipeData.id);
        if (exists) {
            setRecipes(recipes.map((r: Recipe) => (r.id === recipeData.id ? recipeData : r)));
        } else {
            setRecipes([...recipes, recipeData]);
        }
        setIsFormVisible(false);
        setEditingRecipe(null);
    };

    const moveRecipe = (index: number, direction: number) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= recipes.length) return;
        const newRecipes = [...recipes];
        const temp = newRecipes[index];
        newRecipes[index] = newRecipes[newIndex];
        newRecipes[newIndex] = temp;
        setRecipes(newRecipes);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
        {isFormVisible && (
            <Modal onClose={() => setIsFormVisible(false)}>
            <RecipeForm
            recipe={editingRecipe}
            onSave={handleSaveRecipe}
            onCancel={() => setIsFormVisible(false)}
            />
            </Modal>
        )}

        <section>
        <h2 className="text-xl font-heading text-gray-800 dark:text-gray-200 mb-3">Recipes</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-sm">
        {recipes.map((recipe: Recipe, index: number) => (
            <div key={recipe.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md flex items-center justify-between">
            <div className="flex items-center">
            <div className="flex flex-col mr-3 space-y-1">
            <button onClick={() => moveRecipe(index, -1)} disabled={index === 0} className="disabled:opacity-30 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><Icon name="chevronUp" className="w-5 h-5"/></button>
            <button onClick={() => moveRecipe(index, 1)} disabled={index === recipes.length - 1} className="disabled:opacity-30 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><Icon name="chevronDown" className="w-5 h-5"/></button>
            </div>
            <div>
            <p className="font-semibold text-gray-800 dark:text-gray-200">{recipe.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{recipe.description.substring(0, 40)}...</p>
            </div>
            </div>
            <div className="flex space-x-2">
            <button onClick={() => handleEditRecipe(recipe)} className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><Icon name="edit" className="w-5 h-5"/></button>
            <button onClick={() => handleDeleteRecipe(recipe.id)} className="p-2 text-red-500 hover:opacity-80"><Icon name="trash" className="w-5 h-5"/></button>
            </div>
            </div>
        ))}
        <button onClick={handleAddRecipe} className="w-full mt-4 flex items-center justify-center p-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-opacity">
        <Icon name="plus" className="w-6 h-6 mr-2" />
        Add New Recipe
        </button>
        </div>
        </section>

        <section>
        <h2 className="text-xl font-heading text-gray-800 dark:text-gray-200 mb-3">Preferences</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4 shadow-sm">
        <div>
        <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Theme</label>
        <div className="flex space-x-2">
        <button onClick={() => setTheme('light')} className={`flex-1 p-2 rounded-md font-semibold ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Light</button>
        <button onClick={() => setTheme('dark')} className={`flex-1 p-2 rounded-md font-semibold ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Dark</button>
        <button onClick={() => setTheme('system')} className={`flex-1 p-2 rounded-md font-semibold ${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>System</button>
        </div>
        </div>
        <div>
        <label className="block text-gray-600 dark:text-gray-300 font-medium mb-2">Water Temperature Unit</label>
        <div className="flex space-x-2">
        <button onClick={() => setTempUnit('F')} className={`flex-1 p-2 rounded-md font-semibold ${tempUnit === 'F' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Fahrenheit (°F)</button>
        <button onClick={() => setTempUnit('C')} className={`flex-1 p-2 rounded-md font-semibold ${tempUnit === 'C' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Celsius (°C)</button>
        </div>
        </div>
        </div>
        </section>

        <section>
        <h2 className="text-xl font-heading text-gray-800 dark:text-gray-200 mb-3">About</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 text-gray-500 dark:text-gray-400 space-y-2 shadow-sm">
        <p><span className="font-semibold text-gray-700 dark:text-gray-300">BrewCoffee</span> v1.0.0</p>
        <p>Caffeinate Responsibly</p>
        <p><a href="https://github.com/benmordecai/brewcoffee" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View on GitHub</a></p>
        </div>
        </section>
        </div>
    );
};


const MainPage: React.FC<{ recipes: Recipe[]; tempUnit: string }> = ({ recipes, tempUnit }) => {
    
    const [selectedRecipeId, setSelectedRecipeId] = React.useState(recipes[0].id);
    const recipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];

    const [grounds, setGrounds] = React.useState(recipe.suggestedGrounds);
    const [water, setWater] = React.useState(recipe.suggestedGrounds * recipe.ratio);
    const [ratio, setRatio] = React.useState(recipe.ratio);

    

    const [totalSeconds, setTotalSeconds] = React.useState(recipe.timeBetweenPours.minutes * 60 + recipe.timeBetweenPours.seconds);
    const [timer, setTimer] = React.useState(totalSeconds);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [isEditingTime, setIsEditingTime] = React.useState(false);

    const [currentPour, setCurrentPour] = React.useState(1);
    const [isBrewing, setIsBrewing] = React.useState(false);

    React.useEffect(() => {
        const newRecipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];
        setGrounds(newRecipe.suggestedGrounds);
        setWater(newRecipe.suggestedGrounds * newRecipe.ratio);
        setRatio(newRecipe.ratio);
        const newTotalSeconds = newRecipe.timeBetweenPours.minutes * 60 + newRecipe.timeBetweenPours.seconds;
        setTotalSeconds(newTotalSeconds);
        setTimer(newTotalSeconds);
        setCurrentPour(1);
        setIsTimerRunning(false);
        setIsBrewing(false);
    }, [selectedRecipeId, recipes]);

    const handleGroundsChange = (newGrounds: number) => {
        setGrounds(newGrounds);
        setWater(Math.round(newGrounds * ratio));
    };

    const handleWaterChange = (newWater: number) => {
        setWater(newWater);
        setGrounds(Number((newWater / ratio).toFixed(1)));
    };

    const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRatio = Number(e.target.value);
        setRatio(newRatio);
        setWater(Math.round(grounds * newRatio));
    };

    React.useEffect(() => {
        let interval: number | null = null;
        if (isTimerRunning && timer > 0) {
            interval = window.setInterval(() => {
                setTimer(t => t - 1);
            }, 1000);
        } else if (isTimerRunning && timer === 0) {
            console.log("Timer reached zero, attempting to trigger notification.");
            setIsTimerRunning(false);
            (async () => {
                await playNotificationSound();
            })();
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isTimerRunning, timer]);

    const handleStartStop = () => {
        if (!isBrewing) {
            setIsBrewing(true);
            setIsTimerRunning(true);
            return;
        }

        if (isTimerRunning) {
            setIsTimerRunning(false);
        } else {
            if (timer > 0) {
                setIsTimerRunning(true);
            } else {
                if (currentPour < recipe.pours) {
                    setCurrentPour(p => p + 1);
                    setTimer(totalSeconds);
                    setIsTimerRunning(true);
                } else {
                    handleReset();
                }
            }
        }
    };

    const handleReset = () => {
        const currentRecipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];
        setGrounds(currentRecipe.suggestedGrounds);
        setWater(currentRecipe.suggestedGrounds * currentRecipe.ratio);
        setRatio(currentRecipe.ratio);
        const newTotalSeconds = currentRecipe.timeBetweenPours.minutes * 60 + currentRecipe.timeBetweenPours.seconds;
        setTotalSeconds(newTotalSeconds);
        setTimer(newTotalSeconds);
        setCurrentPour(1);
        setIsTimerRunning(false);
        setIsBrewing(false);
        setIsEditingTime(false);
    };

    const handleTimeEditSave = (newMinutes: number, newSeconds: number) => {
        const newTotal = (newMinutes * 60) + newSeconds;
        setTotalSeconds(newTotal);
        setTimer(newTotal);
        setIsEditingTime(false);
    };

    const formatTime = (s: number) => {
        const minutes = Math.floor(s / 60);
        const seconds = s % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const waterPerPour = water / recipe.pours;
    const pourStart = (currentPour - 1) * waterPerPour;
    const pourEnd = currentPour * waterPerPour;

    const getButtonText = () => {
        if (!isBrewing) return 'Start';
        if (isTimerRunning) return 'Pause';
        if (timer === 0) {
            return currentPour < recipe.pours ? 'Continue' : 'Finish';
        }
        return 'Resume';
    };

    const convertTemp = (temp: { value: number; unit: string }) => {
        if (temp.unit === tempUnit) return temp.value;
        if (tempUnit === 'C') {
            return Math.round((temp.value - 32) * 5/9);
        } else {
            return Math.round(temp.value * 9/5 + 32);
        }
    };

    return (
        <div className="p-4 md:p-6 space-y-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <select
        value={selectedRecipeId}
        onChange={e => setSelectedRecipeId(e.target.value)}
        className="w-full bg-gray-100 dark:bg-gray-700 p-3 rounded-md border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 font-heading text-lg focus:ring-blue-500 focus:border-blue-500"
        >
        {recipes.map((r: Recipe) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">{recipe.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium">Grounds</label>
        <div className="flex items-center justify-center">
            <button onClick={() => handleGroundsChange(grounds - 1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">-</button>
            <input type="number" value={grounds} onChange={(e) => handleGroundsChange(parseInt(e.target.value, 10) || 0)} className="w-full text-center bg-transparent text-gray-800 dark:text-gray-200 text-2xl font-bold focus:outline-none" />
            <button onClick={() => handleGroundsChange(grounds + 1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">+</button>
        </div>
        <span className="text-gray-500 dark:text-gray-400">grams</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium">Water</label>
        <div className="flex items-center justify-center">
            <button onClick={() => handleWaterChange(water - 1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">-</button>
            <input type="number" value={water} onChange={(e) => handleWaterChange(Number(e.target.value))} className="w-full text-center bg-transparent text-gray-800 dark:text-gray-200 text-2xl font-bold focus:outline-none" />
            <button onClick={() => handleWaterChange(water + 1)} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">+</button>
        </div>
        <span className="text-gray-500 dark:text-gray-400">grams</span>
        </div>
        </div>

        

        <div className="grid grid-cols-2 gap-4">
        <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium">Ratio</label>
        <select value={ratio} onChange={handleRatioChange} className="block mx-auto bg-transparent text-gray-800 dark:text-gray-200 text-4xl font-bold focus:outline-none appearance-none text-center">
        {Array.from({length: 11}, (_, i) => i + 10).map(n => <option key={n} value={n}>1:{n}</option>)}
        </select>
        </div>

        <div className="w-full">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Pour: <span className="font-bold text-gray-800 dark:text-gray-200">{currentPour}</span> / {recipe.pours}</p>
        <p className="text-gray-800 dark:text-gray-200 text-xl font-bold mt-1">{Math.round(pourStart)}g - {Math.round(pourEnd)}g</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Target Water Range</p>
        </div>
        </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <div className="flex justify-center items-center">
        {isEditingTime ? (
            <TimeEditForm initialTime={totalSeconds} onSave={handleTimeEditSave} onCancel={() => setIsEditingTime(false)} />
        ) : (
            <>
            <h3 className="text-7xl font-mono font-bold text-gray-800 dark:text-gray-200 tracking-wider">{formatTime(timer)}</h3>
            {!isBrewing &&
                <button onClick={() => setIsEditingTime(true)} className="ml-4 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400">
                <Icon name="edit" className="w-6 h-6" />
                </button>
            }
            </>
        )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Time Between Pours</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
        <button onClick={handleReset} className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-lg shadow-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Reset</button>
        <button onClick={handleStartStop} className="p-4 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-sm hover:bg-blue-700 transition-opacity">
        {getButtonText()}
        </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center">
        <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Grind</p>
        <p className="text-gray-800 dark:text-gray-200 font-semibold">{recipe.grind}</p>
        </div>
        <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Water Temp</p>
        <p className="text-gray-800 dark:text-gray-200 font-semibold">{convertTemp(recipe.waterTemperature)}°{tempUnit}</p>
        </div>
        <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Pours</p>
        <p className="text-gray-800 dark:text-gray-200 font-semibold">{recipe.pours}</p>
        </div>
        </div>
        {recipe.comments && (
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Comments</h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{recipe.comments}</p>
            </div>
        )}
        </div>

        </div>
    );
};

const TimeEditForm: React.FC<{ initialTime: number; onSave: (minutes: number, seconds: number) => void; onCancel: () => void }> = ({ initialTime, onSave, onCancel }) => {
    const [minutes, setMinutes] = React.useState(Math.floor(initialTime / 60));
    const [seconds, setSeconds] = React.useState(initialTime % 60);

    const handleSave = () => {
        onSave(minutes, seconds);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value, 10) || 0;
        if (val < 0) val = 0;
        setMinutes(val);
    }

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value, 10) || 0;
        if (val < 0) val = 0;
        if (val > 59) val = 59;
        setSeconds(val);
    }

    return (
        <div className="flex items-center space-x-1">
        <input type="number" value={minutes} onChange={handleMinutesChange} className="w-24 text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-3xl font-mono font-bold focus:outline-none rounded-md p-2" />
        <span className="text-3xl font-mono font-bold text-gray-800 dark:text-gray-200">:</span>
        <input type="number" value={seconds} onChange={handleSecondsChange} className="w-24 text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-3xl font-mono font-bold focus:outline-none rounded-md p-2" />
        <button onClick={handleSave} className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md">Save</button>
        <button onClick={onCancel} className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md">Cancel</button>
        </div>
    );
};


function App() {
    const [page, setPage] = React.useState<string>('main');
    const [recipes, setRecipes] = useLocalStorage<Recipe[]>('brewcoffee-recipes', initialRecipes);
    const [theme, setTheme] = useLocalStorage<string>('brewcoffee-theme', 'system');
    const [tempUnit, setTempUnit] = useLocalStorage<string>('brewcoffee-temp-unit', 'F');

    React.useEffect(() => {
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
    }, [theme]);

    if (!recipes || recipes.length === 0) {
        setRecipes(initialRecipes);
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-body text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Header page={page} setPage={setPage} />
        <main className="max-w-3xl mx-auto pb-16">
        {page === 'main' ? (
            <MainPage recipes={recipes} tempUnit={tempUnit} />
        ) : (
            <SettingsPage
            recipes={recipes}
            setRecipes={setRecipes}
            theme={theme}
            setTheme={setTheme}
            tempUnit={tempUnit}
            setTempUnit={setTempUnit}
            />
        )}
        </main>
        
        </div>
    );
}

export default App;
