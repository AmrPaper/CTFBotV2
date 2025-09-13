export type Fields = {
    name: string;
    value: string;
    inline: boolean;
}[]

export type SetBrief = {
    id: string;
    name: string;
    description: string;
    path: string;
}

export type Index = {
    activeSetID: string;
    activeSetName: string;
    sets: SetBrief[];
}

export type Phase = {
    id: number;
    name: string;
    description: string;
    challengeText: string;
    flag: string;
    files: string[];
    timeLimit: number | null;
    color: string;
}

export type Ending = {
    endingID: number;
    title: string;
    description: string;
    color: string;
    message: string;
    condition: string;
}

export type ChallengeSet = {
    name: string;
    author: string;
    comment: string;
    tags: string[];
    description: string;
    phases: Phase[];
    endings: Ending[];
}