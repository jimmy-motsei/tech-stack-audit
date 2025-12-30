import { NextRequest, NextResponse } from 'next/server';
import { auditTechStack } from '@/lib/audit/engine';
import { supabaseAdmin } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, selectedTools, companySize, industry, teamSize } = body;

    // 1. Validate Input
    if (!email || !selectedTools || selectedTools.length === 0) {
      return NextResponse.json(
        { error: 'Email and at least one tool are required' },
        { status: 400 }
      );
    }

    // 2. Run Audit Analysis
    const input = {
      selectedTools,
      companySize,
      industry,
      teamSize,
    };

    const results = await auditTechStack(input);

    // 3. Save to Database (if Admin client is configured)
    if (supabaseAdmin) {
      // Create/Update Lead
      await supabaseAdmin
        .from('leads')
        .upsert({
          email,
          company_size: companySize,
          industry,
          team_size: teamSize,
          last_seen: new Date().toISOString(),
        }, { onConflict: 'email', ignoreDuplicates: false });

      // Save Assessment
      const { error } = await supabaseAdmin
        .from('assessments')
        .insert({
          email,
          company_name: 'Unknown', // Could be added to form
          status: 'completed',
          input_data: input,
          analysis_data: results,
          score: results.score,
          recommendations: results.recommendations,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Database save error:', error);
      }
    }

    return NextResponse.json({ success: true, data: results });

  } catch (error) {
    console.error('Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error processing audit' },
      { status: 500 }
    );
  }
}
