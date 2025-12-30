"use client";

import { TrendingUp, AlertTriangle } from 'lucide-react';
import { TechAuditResult } from '@/types';

function getScoreColor(score: number) {
  if (score >= 80) return 'from-green-400 to-emerald-500';
  if (score >= 60) return 'from-yellow-400 to-orange-500';
  return 'from-red-400 to-red-500';
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high': return 'text-red-400 bg-red-400/10';
    case 'medium': return 'text-yellow-400 bg-yellow-400/10';
    default: return 'text-green-400 bg-green-400/10';
  }
}

export function TechAuditResults({ results }: { results: TechAuditResult }) {
  return (
    <div className="space-y-8">
      {/* Efficiency Score */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br ${getScoreColor(results.score)} rounded-full mb-4`}>
          <span className="text-4xl font-bold text-black">{results.score}</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-2">Tech Stack Efficiency</h2>
        <p className="text-zinc-400 text-lg">
          {results.score >= 80 ? 'Highly Optimized' : results.score >= 60 ? 'Room for Improvement' : 'Needs Optimization'}
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-white">${results.totalMonthlyCost.toLocaleString()}</div>
          <div className="text-sm text-zinc-400">Monthly Cost</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">${results.summary.potentialSavings.toLocaleString()}</div>
          <div className="text-sm text-zinc-400">Potential Savings</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">{results.summary.redundancyCount}</div>
          <div className="text-sm text-zinc-400">Redundancies</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">{results.summary.underutilizedTools}</div>
          <div className="text-sm text-zinc-400">Underutilized</div>
        </div>
      </div>

      {/* Redundancies */}
      {results.redundancies.length > 0 && (
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Redundancies Detected
          </h3>
          <div className="space-y-4">
            {results.redundancies.map((redundancy, index) => (
              <div key={index} className="p-4 bg-zinc-800/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white">{redundancy.category}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(redundancy.severity)}`}>
                    {redundancy.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-zinc-300 text-sm mb-3">{redundancy.description}</p>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-zinc-400">
                    Tools: {redundancy.tools.join(', ')}
                  </div>
                  <div className="text-green-400 font-medium">
                    Save ${redundancy.potentialSavings.toLocaleString()}/month
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          Optimization Recommendations
        </h3>
        <div className="space-y-3">
          {results.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg">
              <div className="w-6 h-6 bg-green-400/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-green-400">{index + 1}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA / Next Steps */}
      <div className="p-6 bg-gradient-to-r from-teal-900/20 to-blue-900/20 border border-teal-800/30 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-2">Ready to Optimize Your Tech Stack?</h3>
        <p className="text-zinc-400 mb-4">
          Get expert help implementing these recommendations.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-6 py-3 bg-primary text-black font-medium rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
            Schedule Optimization Call
          </button>
          <button className="px-6 py-3 border border-zinc-600 text-white font-medium rounded-lg hover:border-zinc-500 transition-colors cursor-pointer">
            Download Full Report
          </button>
        </div>
      </div>
    </div>
  );
}
