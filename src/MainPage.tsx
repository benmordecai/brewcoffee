import React from 'react';
import { Icon } from './Icon';

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
  if (input.includes(":")) {
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
  } else {
    const totalSeconds = parseInt(input, 10);
    if (isNaN(totalSeconds) || totalSeconds < 0) {
      throw new Error("Invalid time format. Must be a non-negative number or mm:ss.");
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
  }
}

function toTotalSeconds(minutes: number, seconds: number): number {
  return minutes * 60 + seconds;
}

const formatTime = (s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const TimeEditForm: React.FC<{ initialTime: number; onSave: (totalSeconds: number) => void; onCancel: () => void }> = ({ initialTime, onSave, onCancel }) => {
    const [timeString, setTimeString] = React.useState(formatTime(initialTime));
    const [error, setError] = React.useState<string | null>(null);

    const handleSave = () => {
        try {
            const { minutes, seconds } = parseTimeInput(timeString);
            onSave(toTotalSeconds(minutes, seconds));
            setError(null);
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center space-x-1">
                <input
                    type="text"
                    value={timeString}
                    onChange={(e) => setTimeString(e.target.value)}
                    className="w-40 text-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-3xl font-mono font-bold focus:outline-none rounded-md p-2"
                    placeholder="mm:ss"
                />
                <button onClick={handleSave} className="ml-2 px-3 py-2 bg-blue-600 text-white rounded-md">Save</button>
                <button onClick={onCancel} className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md">Cancel</button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};


export const MainPage: React.FC<{
    recipes: Recipe[];
    tempUnit: string;
    selectedRecipeId: string;
    setSelectedRecipeId: React.Dispatch<React.SetStateAction<string>>;
    grounds: string;
    setGrounds: React.Dispatch<React.SetStateAction<string>>;
    water: string;
    setWater: React.Dispatch<React.SetStateAction<string>>;
    ratio: number;
    setRatio: React.Dispatch<React.SetStateAction<number>>;
    totalSeconds: number;
    setTotalSeconds: React.Dispatch<React.SetStateAction<number>>;
    timer: number;
    setTimer: React.Dispatch<React.SetStateAction<number>>;
    isTimerRunning: boolean;
    setIsTimerRunning: React.Dispatch<React.SetStateAction<boolean>>;
    isEditingTime: boolean;
    setIsEditingTime: React.Dispatch<React.SetStateAction<boolean>>;
    currentPour: number;
    setCurrentPour: React.Dispatch<React.SetStateAction<number>>;
    isBrewing: boolean;
    setIsBrewing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    recipes,
    tempUnit,
    selectedRecipeId,
    setSelectedRecipeId,
    grounds,
    setGrounds,
    water,
    setWater,
    ratio,
    setRatio,
    totalSeconds,
    setTotalSeconds,
    timer,
    setTimer,
    isTimerRunning,
    setIsTimerRunning,
    isEditingTime,
    setIsEditingTime,
    currentPour,
    setCurrentPour,
    isBrewing,
    setIsBrewing,
}) => {
    const recipe = recipes.find((r: Recipe) => r.id === selectedRecipeId) || recipes[0];

    

    const handleGroundsChange = (newGrounds: string) => {
        const num = parseFloat(newGrounds);
        if (newGrounds === '' || (!isNaN(num) && num >= 0)) {
            setGrounds(newGrounds);
            if (newGrounds !== '' && !isNaN(num)) {
                setWater(String(Math.round(num * ratio)));
            }
        }
    };

    const handleWaterChange = (newWater: string) => {
        const num = parseFloat(newWater);
        if (newWater === '' || (!isNaN(num) && num >= 0)) {
            setWater(newWater);
            if (newWater !== '' && !isNaN(num)) {
                setGrounds(String(Number((num / ratio).toFixed(1))));
            }
        }
    };

    const handleRatioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newRatio = Number(e.target.value);
        setRatio(newRatio);
        const numGrounds = parseFloat(grounds);
        if (!isNaN(numGrounds)) {
            setWater(String(Math.round(numGrounds * newRatio)));
        }
    };

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
        setGrounds(String(currentRecipe.suggestedGrounds));
        setWater(String(currentRecipe.suggestedGrounds * currentRecipe.ratio));
        setRatio(currentRecipe.ratio);
        const newTotalSeconds = currentRecipe.timeBetweenPours.minutes * 60 + currentRecipe.timeBetweenPours.seconds;
        setTotalSeconds(newTotalSeconds);
        setTimer(newTotalSeconds);
        setCurrentPour(1);
        setIsTimerRunning(false);
        setIsBrewing(false);
        setIsEditingTime(false);
    };

    const handleTimeEditSave = (newTotal: number) => {
        setTotalSeconds(newTotal);
        setTimer(newTotal);
        setIsEditingTime(false);
    };

    const waterPerPour = Number(water) / recipe.pours;
    const pourStart = (currentPour - 1) * waterPerPour;
    const pourEnd = currentPour * waterPerPour;

    const getButtonText = () => {
        if (!isBrewing) return 'Start';
        if (isTimerRunning) return 'Pause';
        if (timer === 0 && currentPour < recipe.pours) {
            return 'Continue';
        }
        if (timer === 0 && currentPour >= recipe.pours) {
            return 'Finish';
        }
        return 'Resume';
    };

    const convertTemp = (temp: { value: number; unit: string }) => {
        if (temp.unit === tempUnit) return temp.value;
        if (tempUnit === 'C') {
            return Math.round((temp.value - 32) * 5/9);
        }
        return Math.round(temp.value * 9/5 + 32);
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
            <button onClick={() => handleGroundsChange(String(Number(grounds) - 1))} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">-</button>
            <input type="number" inputMode="numeric" value={grounds} onChange={(e) => handleGroundsChange(e.target.value)} className="w-full text-center bg-transparent text-gray-800 dark:text-gray-200 text-2xl font-bold focus:outline-none" />
            <button onClick={() => handleGroundsChange(String(Number(grounds) + 1))} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">+</button>
        </div>
        <span className="text-gray-500 dark:text-gray-400">grams</span>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <label className="text-gray-500 dark:text-gray-400 text-sm font-medium">Water</label>
        <div className="flex items-center justify-center">
            <button onClick={() => handleWaterChange(String(Number(water) - 1))} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">-</button>
            <input type="number" inputMode="numeric" value={water} onChange={(e) => handleWaterChange(e.target.value)} className="w-full text-center bg-transparent text-gray-800 dark:text-gray-200 text-2xl font-bold focus:outline-none" />
            <button onClick={() => handleWaterChange(String(Number(water) + 1))} className="px-3 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-2xl font-bold">+</button>
        </div>
        <span className="text-gray-500 dark:text-gray-400">grams</span>
        </div>
        </div>

        

        <div className="grid grid-cols-2 gap-4">
        <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <label className="block text-gray-500 dark:text-gray-400 text-sm font-medium">Ratio</label>
        <select value={ratio} onChange={handleRatioChange} className="block mx-auto bg-transparent text-gray-800 dark:text-gray-200 text-4xl font-bold focus:outline-none appearance-none text-center">
        {Array.from({length: 11}, (_, i) => i + 10).map(n => <option key={n} value={n}>1:{n}</option>)}
        </select>
        </div>

        <div className="w-full">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">Pour: <span className="font-bold text-gray-800 dark:text-gray-200">{currentPour}</span> / {recipe.pours}</p>
        <p className="text-800 dark:text-gray-200 text-xl font-bold mt-1">{Math.round(pourStart)}g - {Math.round(pourEnd)}g</p>
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
