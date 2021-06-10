export interface Task {
    nativeName: string;
    params: any[];
    timeToWaitInMs: number;
}

export interface TaskCallback {
    callbackName: string;
}
