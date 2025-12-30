"use client";

import { useState } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { Tool, SelectedTool } from '@/types';

interface ToolSelectionInterfaceProps {
  availableTools: Tool[];
  selectedTools: SelectedTool[];
  onAddTool: (tool: Tool) => void;
  onRemoveTool: (toolId: string) => void;
  onUpdateTool: (toolId: string, field: keyof SelectedTool, value: unknown) => void;
}

export function ToolSelectionInterface({
  availableTools,
  selectedTools,
  onAddTool,
  onRemoveTool,
  onUpdateTool
}: ToolSelectionInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(availableTools.map(tool => tool.category))];

  const filteredTools = availableTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const notSelected = !selectedTools.some(selected => selected.toolId === tool.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  return (
    <>
      {/* Tool Selection */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Select Your Tools</h2>
        
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none placeholder-zinc-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:border-primary focus:outline-none"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>

        {/* Available Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {filteredTools.slice(0, 12).map(tool => (
            <div key={tool.id} className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white">{tool.name}</h3>
                <button
                  onClick={() => onAddTool(tool)}
                  className="p-1 text-primary hover:bg-primary/10 rounded cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-2">{tool.category}</p>
              <p className="text-sm text-zinc-400 mb-2 line-clamp-2">{tool.description}</p>
              <p className="text-sm font-medium text-green-400">${tool.avg_monthly_cost}/month</p>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Tools List */}
      {selectedTools.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Your Tech Stack ({selectedTools.length} tools)</h2>
          <div className="space-y-4">
            {selectedTools.map(tool => (
              <div key={tool.toolId} className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-white">{tool.name}</h3>
                    <p className="text-xs text-zinc-500">{tool.category}</p>
                  </div>
                  <button
                    onClick={() => onRemoveTool(tool.toolId)}
                    className="p-1 text-red-400 hover:bg-red-400/10 rounded cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Monthly Cost ($)</label>
                    <input
                      type="number"
                      value={tool.monthlyCost}
                      onChange={(e) => onUpdateTool(tool.toolId, 'monthlyCost', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm focus:border-primary focus:outline-none"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Users</label>
                    <input
                      type="number"
                      value={tool.usersCount}
                      onChange={(e) => onUpdateTool(tool.toolId, 'usersCount', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm focus:border-primary focus:outline-none"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Usage Frequency</label>
                    <select
                      value={tool.usageFrequency}
                      onChange={(e) => onUpdateTool(tool.toolId, 'usageFrequency', e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded text-white text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="rarely">Rarely</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Total Monthly Cost:</span>
              <span className="text-2xl font-bold text-primary">
                ${selectedTools.reduce((sum, tool) => sum + (tool.monthlyCost * tool.usersCount), 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
