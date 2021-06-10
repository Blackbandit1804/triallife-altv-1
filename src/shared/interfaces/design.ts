export interface Design {
    sex: number;
    faceFather: number;
    faceMother: number;
    skinFather: number;
    skinMother: number;
    faceMix: number;
    skinMix: number;
    structure: number[];
    hair: number;
    hairColor1: number;
    hairColor2: number;
    hairOverlay: { overlay: string; collection: string };
    facialHair: number;
    facialHairColor1: number;
    facialHairOpacity: number;
    eyebrows: number;
    eyebrowsOpacity: number;
    eyebrowsColor1: number;
    eyes: number;
    opacityOverlays: DesignInfo[];
    colorOverlays: ColorInfo[];
}

export interface ColorInfo {
    id: number;
    value: number;
    color1: number;
    color2: number;
    opacity: number;
}

export interface DesignInfo {
    value: number;
    opacity: number;
    id: number;
    collection: string;
    overlay: string;
}
