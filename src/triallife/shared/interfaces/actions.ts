export interface Action {
    eventName: string;
    isServer?: boolean;
    data?: any;
}

export interface ActionMenu {
    [key: string]: Action | ActionMenu;
}
