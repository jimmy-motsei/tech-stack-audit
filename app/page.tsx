"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { AtmosphericBackground } from '@/components/ui/AtmosphericBackground';
import { ToolSelectionInterface } from '@/components/ToolSelectionInterface';
import { TechAuditResults } from '@/components/TechAuditResults';
import { Tool, SelectedTool, TechAuditResult } from '@/types';

export default function Home() {
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<SelectedTool[]>([]);
  const [companySize, setCompanySize] = useState('');
  const [industry, setIndustry] = useState('');
  const [teamSize, setTeamSize] = useState(10);
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<TechAuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailableTools();
  }, []);

  const fetchAvailableTools = async () => {
    try {
      const response = await fetch('/api/tools');
      const data = await response.json();
      if (data.success) {
        setAvailableTools(data.tools);
      }
    } catch (error) {
      console.error('Failed to fetch tools:', error);
    }
  };

  const addTool = (tool: Tool) => {
    const newTool: SelectedTool = {
      toolId: tool.id,
      name: tool.name,
      category: tool.category,
      monthlyCost: tool.avg_monthly_cost || 0,
      usersCount: 1,
      usageFrequency: 'daily',
    };
    setSelectedTools([...selectedTools, newTool]);
  };

  const removeTool = (toolId: string) => {
    setSelectedTools(selectedTools.filter(tool => tool.toolId !== toolId));
  };

  const updateTool = (toolId: string, field: keyof SelectedTool, value: any) => {
    setSelectedTools(selectedTools.map(tool => 
      tool.toolId === toolId ? { ...tool, [field]: value } : tool
    ));
  };

  const handleSubmit = async () => {
    if (selectedTools.length === 0 || !email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          selectedTools,
          companySize,
          industry,
          teamSize,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setResults(result.data);
      }
    } catch (error) {
      console.error('Tech audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        <AtmosphericBackground variant="default" className="z-0" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Analyzing Your Tech Stack</h2>
          <p className="text-zinc-400">Calculating ROI and identifying optimization opportunities...</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="min-h-screen bg-black py-12 relative overflow-hidden">
        <AtmosphericBackground variant="subtle" className="z-0" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4">Tech Stack Analysis Results</h1>
            <p className="text-xl text-zinc-400">ROI analysis and optimization recommendations</p>
          </motion.div>

          <TechAuditResults results={results} />
          
          <div className="mt-12 text-center">
            <button 
              onClick={() => setResults(null)}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              ← Analyze Another Stack
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      <AtmosphericBackground variant="hero" className="z-0" />
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Settings className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Tech Stack ROI Auditor</h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Analyze your current tech stack to identify redundancies, optimize costs, and improve efficiency
          </p>
        </motion.div>

        {/* Company Information */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Company Information</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="professional-services">Professional Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Company Size</label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none"
              >
                <option value="">Select Size</option>
                <option value="startup">Startup (1-10 employees)</option>
                <option value="smb">Small Business (11-50 employees)</option>
                <option value="enterprise">Enterprise (50+ employees)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Team Size</label>
              <input
                type="number"
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none"
                min="1"
                max="1000"
              />
            </div>
          </div>
        </div>

        {/* Tool Selection Interface */}
        <ToolSelectionInterface 
          availableTools={availableTools}
          selectedTools={selectedTools}
          onAddTool={addTool}
          onRemoveTool={removeTool}
          onUpdateTool={updateTool}
        />

        {/* Email and Submit */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-white mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none mb-4"
              placeholder="your@email.com"
            />
            <button
              onClick={handleSubmit}
              disabled={selectedTools.length === 0 || !email}
              className="w-full px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Analyze Tech Stack
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Cost Analysis</h3>
            <p className="text-sm text-zinc-400">Identify redundancies and optimize spending</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">ROI Optimization</h3>
            <p className="text-sm text-zinc-400">Maximize value from your tool investments</p>
          </div>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
            <AlertTriangle className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Risk Assessment</h3>
            <p className="text-sm text-zinc-400">Identify underutilized and redundant tools</p>
          </div>
        </div>
      </div>
    </div>
  );
}
