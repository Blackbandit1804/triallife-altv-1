export declare function sha256(data: any): any;
export declare function sha256Random(data: string): string;
export declare function getPublicKey(): Promise<string>;
export declare function getPrivateKey(): string;
export declare function encryptData(jsonData: any): Promise<string>;
export declare function getSharedSecret(): Promise<string>;
export declare function getAzureKey(): Promise<string>;
