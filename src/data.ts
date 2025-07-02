export const initialRecipes = [
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

export const grindOptions = ['Extra Coarse', 'Coarse', 'Medium-Coarse', 'Medium', 'Medium-Fine', 'Fine', 'Very Fine'];
