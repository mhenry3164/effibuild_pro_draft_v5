export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyLogo?: string;
  assistantId?: string;
  customAISettings?: {
    modelPreferences?: {
      temperature?: number;
      maxTokens?: number;
      topP?: number;
    };
    industrySpecificTerms?: string[];
    customPrompts?: Record<string, string>;
    estimationRules?: {
      marginPercentage?: number;
      roundingPrecision?: number;
      contingencyFactor?: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}