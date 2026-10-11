export interface Recipe {
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

export interface RecipeFormData {
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
