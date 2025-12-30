export interface Tool {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  avg_monthly_cost: number;
  description?: string;
}

export interface SelectedTool {
  toolId: string;
  name: string;
  category: string;
  monthlyCost: number;
  usersCount: number;
  usageFrequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
}

export interface TechAuditInput {
  selectedTools: SelectedTool[];
  companySize: string;
  industry: string;
  teamSize: number;
}

export interface TechAuditResult {
  score: number;
  totalMonthlyCost: number;
  redundancies: Redundancy[];
  optimizations: Optimization[];
  recommendations: string[];
  summary: {
    potentialSavings: number;
    efficiencyScore: number;
    redundancyCount: number;
    underutilizedTools: number;
  };
}

export interface Redundancy {
  category: string;
  tools: string[];
  potentialSavings: number;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

export interface Optimization {
  type: 'cost' | 'efficiency' | 'integration';
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
}
