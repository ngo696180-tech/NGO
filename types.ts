
export interface IKeywordGroup {
  explanation: string;
  main: string[];
  lsi: string[];
  questions: string[];
}

export interface ITitleSuggestion {
  title: string;
  pros: string;
  cons: string;
}

export interface IOutputs {
  keywordAnalysis: IKeywordGroup;
  videoHook: string;
  titleSuggestions: ITitleSuggestion[];
  videoDescription: string;
  videoTags: string;
  fullScript: string;
  splitScript: string[];
  qualityReport: string;
}

export interface ICommunityPost {
    postText: string;
    pollOptions: string[];
}
