import React from 'react';
import { MainPage } from './MainPage';
import { useLocalStorage } from './hooks';
import { initialRecipes, grindOptions } from './data';
import { playNotificationSound } from './notifications';
import { Icon } from './Icon';


interface RecipeFormData {
    id: string;
    name: string;
    description: string;
    ratio: string;
    suggestedGrounds: string;
    grind: string;
    waterTemperature: { value: string; unit: string; };
    pours: string;
    timeBetweenPours: string; // mm:ss format
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

function parseTimeInput(input: string): { minutes: number; seconds: number } {
  const [minStr, secStr] = input.split(":");
  const minutes = parseInt(minStr, 10);
  const seconds = parseInt(secStr, 10);
  if (
    isNaN(minutes) ||
    isNaN(seconds) ||
    minutes < 0 ||
    seconds < 0 ||
    seconds > 59
  ) {
    throw new Error("Invalid time format. Use mm:ss with seconds 0-59.");
  }
  return { minutes, seconds };
}

function validateNumeric(value: string, fieldName: string, options: { isInteger?: boolean, min?: number, max?: number } = {}): number {
    const num = Number(value);
    if (isNaN(num)) {
        throw new Error(`${fieldName} must be a number.`);
    }
    if (options.isInteger && !Number.isInteger(num)) {
        throw new Error(`${fieldName} must be a whole number.`);
    }
    if (options.min !== undefined && num < options.min) {
        throw new Error(`${fieldName} must be at least ${options.min}.`);
    }
    if (options.max !== undefined && num > options.max) {
        throw new Error(`${fieldName} must be no more than ${options.max}.`);
    }
    return num;
}

const formatTime = (minutes: number, seconds: number): string => {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const Header: React.FC<{ page: string; setPage: React.Dispatch<React.SetStateAction<string>> }> = ({ page, setPage }) => {
    return (
        <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center shadow-md sticky top-0 z-20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
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
        <div className="fixed inset-0 bg-gray-200 dark:bg-gray-900 bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {children}
        </div>
        </div>
    );
};

const RecipeForm: React.FC<{ recipe: Recipe | null; onSave: (data: Recipe) => void; onCancel: () => void }> = ({ recipe, onSave, onCancel }) => {
    const [formData, setFormData] = React.useState<RecipeFormData>(() => {
        if (recipe) {
            return {
                ...recipe,
                ratio: String(recipe.ratio),
                suggestedGrounds: String(recipe.suggestedGrounds),
                pours: String(recipe.pours),
                waterTemperature: { ...recipe.waterTemperature, value: String(recipe.waterTemperature.value) },
                timeBetweenPours: formatTime(recipe.timeBetweenPours.minutes, recipe.timeBetweenPours.seconds),
            };
        }
        return {
            id: `recipe_${Date.now()}`,
            name: '',
            description: '',
            ratio: '15',
            suggestedGrounds: '20',
            grind: 'Medium',
            waterTemperature: { value: '212', unit: 'F' },
            pours: '3',
            timeBetweenPours: '00:30',
            comments: '',
        };
    });
    const [errors, setErrors] = React.useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (parent: keyof RecipeFormData, child: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as Record<string, any>),
                [child]: value,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        try {
            const time = parseTimeInput(formData.timeBetweenPours);
            const ratio = validateNumeric(formData.ratio, 'Ratio');
            const suggestedGrounds = validateNumeric(formData.suggestedGrounds, 'Suggested Grounds');
            const pours = validateNumeric(formData.pours, 'Pours', { isInteger: true, min: 1, max: 10 });
            const waterTemperatureValue = validateNumeric(formData.waterTemperature.value, 'Water Temperature');

            const numericData: Recipe = {
                ...formData,
                ratio,
                suggestedGrounds,
                pours,
                waterTemperature: { ...formData.waterTemperature, value: waterTemperatureValue },
                timeBetweenPours: time,
            };
            onSave(numericData);
        } catch (err: any) {
            newErrors.form = err.message;
            setErrors(newErrors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-heading text-gray-800 dark:text-gray-200 mb-4">{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
        
        {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}

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
        <select name="ratio" value={formData.ratio} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200">
        {Array.from({length: 11}, (_, i) => i + 10).map(n => <option key={n} value={String(n)}>1:{n}</option>)}
        </select>
        </div>
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Suggested Grounds (g)</label>
        <input type="number" inputMode="numeric" name="suggestedGrounds" value={formData.suggestedGrounds} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
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
        <input type="text" value={formData.waterTemperature.value} onChange={(e) => handleNestedChange('waterTemperature', 'value', e.target.value)} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-l-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 text-sm">
        {formData.waterTemperature.unit}
        </span>
        </div>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pours</label>
        <input type="number" inputMode="numeric" name="pours" value={formData.pours} onChange={handleChange} className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
        </div>
        <div>
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Time Between Pours</label>
        <input type="text" name="timeBetweenPours" value={formData.timeBetweenPours} onChange={handleChange} placeholder="mm:ss" className="w-full bg-gray-100 dark:bg-gray-700 p-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-200" />
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
    const [editingRecipe, setEditingRecipe] = React.useState<Recipe | null>(null);

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

    const handleSaveRecipe = (recipeData: Recipe) => {
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

function App() {
    const [page, setPage] = React.useState<string>('main');
    const [recipes, setRecipes] = useLocalStorage<Recipe[]>('brewcoffee-recipes', initialRecipes);
    const [theme, setTheme] = useLocalStorage<string>('brewcoffee-theme', 'system');
    const [tempUnit, setTempUnit] = useLocalStorage<string>('brewcoffee-temp-unit', 'F');

    // Lifted State
    const [selectedRecipeId, setSelectedRecipeId] = React.useState(recipes[0].id);
    const recipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];
    const [grounds, setGrounds] = React.useState(String(recipe.suggestedGrounds));
    const [water, setWater] = React.useState(String(recipe.suggestedGrounds * recipe.ratio));
    const [ratio, setRatio] = React.useState(recipe.ratio);
    const [totalSeconds, setTotalSeconds] = React.useState(recipe.timeBetweenPours.minutes * 60 + recipe.timeBetweenPours.seconds);
    const [timer, setTimer] = React.useState(totalSeconds);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const [isEditingTime, setIsEditingTime] = React.useState(false);
    const [currentPour, setCurrentPour] = React.useState(1);
    const [isBrewing, setIsBrewing] = React.useState(false);

    React.useEffect(() => {
        const newRecipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];
        setGrounds(String(newRecipe.suggestedGrounds));
        setWater(String(newRecipe.suggestedGrounds * newRecipe.ratio));
        setRatio(newRecipe.ratio);
        const newTotalSeconds = newRecipe.timeBetweenPours.minutes * 60 + newRecipe.timeBetweenPours.seconds;
        setTotalSeconds(newTotalSeconds);
        setTimer(newTotalSeconds);
        setCurrentPour(1);
        setIsTimerRunning(false);
        setIsBrewing(false);
    }, [selectedRecipeId, recipes]);

    React.useEffect(() => {
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
    }, [theme]);

    // Lifted Timer Logic
    React.useEffect(() => {
        let interval: number | null = null;
        if (isTimerRunning && timer > 0) {
            interval = window.setInterval(() => {
                setTimer(t => Math.max(0, t - 1));
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

    if (!recipes || recipes.length === 0) {
        setRecipes(initialRecipes);
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-body text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Header page={page} setPage={setPage} />
        <main className="max-w-3xl mx-auto pb-16">
        {page === 'main' ? (
            <MainPage 
                recipes={recipes}
                tempUnit={tempUnit}
                selectedRecipeId={selectedRecipeId}
                setSelectedRecipeId={setSelectedRecipeId}
                grounds={grounds}
                setGrounds={setGrounds}
                water={water}
                setWater={setWater}
                ratio={ratio}
                setRatio={setRatio}
                totalSeconds={totalSeconds}
                setTotalSeconds={setTotalSeconds}
                timer={timer}
                setTimer={setTimer}
                isTimerRunning={isTimerRunning}
                setIsTimerRunning={setIsTimerRunning}
                isEditingTime={isEditingTime}
                setIsEditingTime={setIsEditingTime}
                currentPour={currentPour}
                setCurrentPour={setCurrentPour}
                isBrewing={isBrewing}
                setIsBrewing={setIsBrewing}
            />
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
