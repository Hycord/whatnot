export interface SpinnerItem {
    id: string;
    name: string;
    type: "ceiling" | "miniceiling" | "floor";
    count: number;
    cost: number;
    value: number;
};

export interface SpinnerHistory {
    time: number;
    item: SpinnerItem;
};

export interface Spinner {
    items: SpinnerItem[];
    history: SpinnerHistory[];
    zoom: number;
    key: "spinner";
};

export interface BattleshipSpace {
    containsShip: boolean;
    hasBeenHit: boolean;
}

export interface BattleshipHistory {
    time: number;
    space: BattleshipSpace;
};

export interface Battleship {
    key: "battleship";
    spaces: BattleshipSpace[][];
    history: BattleshipHistory[];
}


export interface GlobalState {
    games: {
        spinner: Spinner;
        battleship: Battleship;
    };

    admin: {
        activeGame: string | null;
        active: boolean;
    };


    obs: {

        activeScene: "MAIN" | "BUDGET";

    };
};

export const defaultSocketState: GlobalState = {
    games: {
        spinner: {
            key: "spinner",
            items: [],
            history: [],
            zoom: 1,
        },
        battleship: {
            key: "battleship",
            history: [],
            spaces: new Array(10).fill(0).map(() => new Array(10).fill(0).map(() => ({ containsShip: false, hasBeenHit: false })))
        }
    },
    admin: {
        activeGame: null,
        active: false,
    },
    obs: {
        activeScene: "MAIN",
    }
};

export const confettiConfig = {
    elementCount: 50,
    lifetime: 600,
    elementSize: 25,
    startVelocity: 50,
    zIndex: 1000,
};
export const hydraConfig = {
    elementCount: 50,
    lifetime: 250,
    elementSize: 50,
    angle: -90,
    spread: 65,
    startVelocity: 50,
    zIndex: 1000,
    emoji: ["🐉", "🐲"],
}