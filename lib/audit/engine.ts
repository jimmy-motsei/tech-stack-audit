import { generateAIResponse } from '@/lib/ai';
import { supabaseAdmin } from '@/lib/database';
import { 
  TechAuditInput, 
  TechAuditResult, 
  Redundancy, 
  Optimization, 
  SelectedTool,
  Tool
} from '@/types';

export async function auditTechStack(input: TechAuditInput): Promise<TechAuditResult> {
  try {
    // 1. Calculate total costs
    const totalMonthlyCost = input.selectedTools.reduce((sum, tool) => 
      sum + (tool.monthlyCost * tool.usersCount), 0
    );

    // 2. Identify redundancies
    const redundancies = identifyRedundancies(input.selectedTools);

    // 3. Find optimization opportunities
    const optimizations = findOptimizations(input.selectedTools);

    // 4. Calculate efficiency score
    const score = calculateEfficiencyScore(input, redundancies);

    // 5. Generate AI recommendations
    const recommendations = await generateRecommendations(input, redundancies, optimizations);

    // 6. Create summary
    const summary = createSummary(redundancies, optimizations, input.selectedTools);

    return {
      score,
      totalMonthlyCost,
      redundancies,
      optimizations,
      recommendations,
      summary,
    };

  } catch (error) {
    console.error('Tech audit error:', error);
    throw new Error('Failed to audit tech stack');
  }
}

function identifyRedundancies(tools: SelectedTool[]): Redundancy[] {
  const redundancies: Redundancy[] = [];
  const categoryGroups = groupByCategory(tools);

  // Check for redundant tools in same category
  Object.entries(categoryGroups).forEach(([category, categoryTools]) => {
    if (categoryTools.length > 1) {
      // Identify potential redundancies
      const redundantPairs = findRedundantPairs(categoryTools, category);
      redundancies.push(...redundantPairs);
    }
  });

  // Check for underutilized tools
  const underutilized = tools.filter(tool => 
    tool.usageFrequency === 'rarely' && tool.monthlyCost > 20
  );

  underutilized.forEach(tool => {
    redundancies.push({
      category: 'Underutilized',
      tools: [tool.name],
      potentialSavings: tool.monthlyCost * tool.usersCount,
      severity: tool.monthlyCost > 50 ? 'high' : 'medium',
      description: `${tool.name} is rarely used but costs $${tool.monthlyCost * tool.usersCount}/month`,
    });
  });

  return redundancies.sort((a, b) => b.potentialSavings - a.potentialSavings);
}

function groupByCategory(tools: SelectedTool[]): Record<string, SelectedTool[]> {
  return tools.reduce((groups, tool) => {
    const category = tool.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(tool);
    return groups;
  }, {} as Record<string, SelectedTool[]>);
}

function findRedundantPairs(tools: SelectedTool[], category: string): Redundancy[] {
  const redundancies: Redundancy[] = [];

  // Define redundancy patterns
  const redundancyPatterns: Record<string, string[][]> = {
    'Communication': [
      ['Slack', 'Microsoft Teams'],
      ['Zoom', 'Microsoft Teams', 'Google Meet'],
    ],
    'Productivity': [
      ['Google Workspace', 'Microsoft 365'],
    ],
    'Project Management': [
      ['Asana', 'Trello', 'Monday.com'],
    ],
    'CRM': [
      ['HubSpot', 'Salesforce'],
    ],
    'Design': [
      ['Canva', 'Adobe Creative Suite'],
    ],
  };

  const patterns = redundancyPatterns[category] || [];
  
  patterns.forEach(pattern => {
    const matchingTools = tools.filter(tool => 
      pattern.some(patternTool => tool.name.toLowerCase().includes(patternTool.toLowerCase()))
    );

    if (matchingTools.length > 1) {
      const totalCost = matchingTools.reduce((sum, tool) => sum + (tool.monthlyCost * tool.usersCount), 0);
      const cheapestTool = matchingTools.reduce((min, tool) => 
        (tool.monthlyCost * tool.usersCount) < (min.monthlyCost * min.usersCount) ? tool : min
      );
      const potentialSavings = totalCost - (cheapestTool.monthlyCost * cheapestTool.usersCount);

      redundancies.push({
        category,
        tools: matchingTools.map(t => t.name),
        potentialSavings,
        severity: potentialSavings > 100 ? 'high' : potentialSavings > 50 ? 'medium' : 'low',
        description: `Multiple ${category.toLowerCase()} tools detected. Consider consolidating to ${cheapestTool.name}.`,
      });
    }
  });

  return redundancies;
}

function findOptimizations(tools: SelectedTool[]): Optimization[] {
  const optimizations: Optimization[] = [];

  // Cost optimizations
  const expensiveTools = tools.filter(tool => tool.monthlyCost > 50);
  expensiveTools.forEach(tool => {
    optimizations.push({
      type: 'cost',
      description: `Review ${tool.name} pricing - consider downgrading plan or negotiating volume discount`,
      impact: tool.monthlyCost * 0.2, // 20% potential savings
      effort: 'low',
    });
  });

  // Usage optimizations
  const weeklyTools = tools.filter(tool => tool.usageFrequency === 'weekly');
  weeklyTools.forEach(tool => {
    optimizations.push({
      type: 'efficiency',
      description: `Increase ${tool.name} adoption - currently underutilized for its cost`,
      impact: tool.monthlyCost * 0.3,
      effort: 'medium',
    });
  });

  // Integration opportunities
  const categories = [...new Set(tools.map(t => t.category))];
  if (categories.length > 5) {
    optimizations.push({
      type: 'integration',
      description: 'Consider integrated platforms to reduce tool sprawl and improve workflow',
      impact: tools.length * 10, // Estimated efficiency gain
      effort: 'high',
    });
  }

  return optimizations.sort((a, b) => b.impact - a.impact);
}

function calculateEfficiencyScore(
  input: TechAuditInput, 
  redundancies: Redundancy[]
): number {
  let score = 100;

  // Deduct for redundancies
  redundancies.forEach(redundancy => {
    const deduction = redundancy.severity === 'high' ? 15 : redundancy.severity === 'medium' ? 10 : 5;
    score -= deduction;
  });

  // Deduct for high costs relative to team size
  const costPerUser = input.selectedTools.reduce((sum, tool) => sum + tool.monthlyCost, 0) / input.teamSize;
  if (costPerUser > 100) score -= 20;
  else if (costPerUser > 50) score -= 10;

  // Deduct for tool sprawl
  if (input.selectedTools.length > 15) score -= 15;
  else if (input.selectedTools.length > 10) score -= 10;

  // Bonus for good practices
  const dailyTools = input.selectedTools.filter(t => t.usageFrequency === 'daily');
  if (dailyTools.length / input.selectedTools.length > 0.7) score += 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

async function generateRecommendations(
  input: TechAuditInput,
  redundancies: Redundancy[],
  optimizations: Optimization[]
): Promise<string[]> {
  try {
    const prompt = `Analyze this tech stack audit and provide 4-5 specific, actionable recommendations:

Company: ${input.companySize} company in ${input.industry}
Team Size: ${input.teamSize}
Tools: ${input.selectedTools.map(t => `${t.name} ($${t.monthlyCost}/month, ${t.usageFrequency} use)`).join(', ')}

Redundancies Found: ${redundancies.length}
Top Redundancy: ${redundancies[0]?.description || 'None'}

Optimization Opportunities: ${optimizations.length}
Top Optimization: ${optimizations[0]?.description || 'None'}

Provide recommendations as a JSON array focusing on:
1. Cost reduction opportunities
2. Efficiency improvements
3. Tool consolidation
4. Usage optimization
5. Integration opportunities

Format: ["recommendation 1", "recommendation 2", ...]`;

    const response = await generateAIResponse(prompt);
    // Sanitize response to ensure it's valid JSON
    const jsonStr = response.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('AI recommendation generation error:', error);
    
    // Fallback recommendations
    const recommendations: string[] = [];
    
    if (redundancies.length > 0) {
      recommendations.push(`Address ${redundancies[0].category} redundancy to save $${redundancies[0].potentialSavings}/month`);
    }
    
    if (optimizations.length > 0) {
      recommendations.push(optimizations[0].description);
    }
    
    recommendations.push('Conduct quarterly tech stack reviews to identify new optimization opportunities');
    recommendations.push('Implement usage tracking to better understand tool ROI');
    recommendations.push('Consider integrated platforms to reduce tool sprawl');
    
    return recommendations.slice(0, 5);
  }
}

function createSummary(redundancies: Redundancy[], optimizations: Optimization[], tools: SelectedTool[]) {
  const potentialSavings = redundancies.reduce((sum, r) => sum + r.potentialSavings, 0) +
    optimizations.filter(o => o.type === 'cost').reduce((sum, o) => sum + o.impact, 0);

  const efficiencyScore = Math.round(
    (tools.filter(t => t.usageFrequency === 'daily').length / tools.length) * 100
  );

  const underutilizedTools = tools.filter(t => t.usageFrequency === 'rarely').length;

  return {
    potentialSavings: Math.round(potentialSavings),
    efficiencyScore,
    redundancyCount: redundancies.length,
    underutilizedTools,
  };
}

// Helper function to get available tools from database
export async function getAvailableTools(): Promise<Tool[]> {
  try {
    if (!supabaseAdmin) {
      console.warn('Supabase admin client not initialized');
      return [];
    }
    const { data: tools, error } = await supabaseAdmin
      .from('tools')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching tools:', error);
      return [];
    }

    return (tools as Tool[]) || [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}
