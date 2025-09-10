// Next.js App Router API route to fetch individual Sahha profiles with real scores
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface SahhaAuthResponse {
  accountToken: string;
  tokenType?: string;
}

interface SahhaProfile {
  id: string;
  externalId: string;
  createdDateTime: string;
  updatedDateTime: string;
  isSampleProfile?: boolean;
  deviceType?: string;
}

interface ProfileResponse {
  items: SahhaProfile[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

interface ProfileScore {
  profileId: string;
  score: number;
  scoreDate: string;
  factorCount?: number;
  factors?: any[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeScores = searchParams.get('includeScores') === 'true';

  try {
    console.log('🔍 Fetching individual Sahha profiles...');
    
    // Get credentials from headers if provided, otherwise use environment variables
    const headers = request.headers;
    const clientId = headers.get('X-Client-Id') || process.env.SAHHA_CLIENT_ID;
    const clientSecret = headers.get('X-App-Secret') || process.env.SAHHA_CLIENT_SECRET;
    
    if (!clientId || !clientSecret) {
      console.error('❌ Missing credentials');
      return NextResponse.json({
        success: false,
        error: 'Missing API credentials'
      }, { status: 401 });
    }
    
    console.log('🔑 Using credentials:', { clientId: clientId?.substring(0, 8) + '...' });
    
    // Step 1: Authenticate with Sahha API
    const authResponse = await axios.post<SahhaAuthResponse>(
      `${process.env.NEXT_PUBLIC_SAHHA_API_BASE_URL}/api/v1/oauth/account/token`,
      {
        clientId: clientId,
        clientSecret: clientSecret,
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const accountToken = authResponse.data.accountToken;
    console.log('✅ Authentication successful');

    // Step 2: Fetch all profiles
    const profileResponse = await axios.get<ProfileResponse>(
      `${process.env.NEXT_PUBLIC_SAHHA_API_BASE_URL}/api/v1/account/profile/search`,
      {
        headers: {
          'Authorization': `Bearer ${accountToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          pageSize: 100,
          currentPage: 1
        }
      }
    );

    const profiles = profileResponse.data.items || [];
    console.log(`📊 Found ${profiles.length} profiles from Sahha API`);
    
    // Log sample profile to verify it's from Sahha
    if (profiles.length > 0) {
      console.log('📝 Sample profile from Sahha:', {
        id: profiles[0].id,
        externalId: profiles[0].externalId,
        createdDateTime: profiles[0].createdDateTime,
        isSampleProfile: profiles[0].isSampleProfile
      });
    }

    if (!includeScores) {
      return NextResponse.json({
        success: true,
        profiles: profiles,
        data: profiles,
        count: profiles.length,
        timestamp: new Date().toISOString()
      });
    }

    // Step 3: Fetch scores for each profile if requested
    console.log('🔍 Fetching health scores for each profile...');
    const profilesWithScores = await Promise.all(
      profiles.map(async (profile) => {
        try {
          // Fetch scores directly using account token and correct endpoint
          const wellbeingScore = await fetchProfileScore(accountToken, profile.externalId, 'wellbeing');
          const activityScore = await fetchProfileScore(accountToken, profile.externalId, 'activity'); 
          const sleepScore = await fetchProfileScore(accountToken, profile.externalId, 'sleep');
          const mentalHealthScore = await fetchProfileScore(accountToken, profile.externalId, 'mental wellbeing'); // Note: space, not underscore
          const readinessScore = await fetchProfileScore(accountToken, profile.externalId, 'readiness');

          console.log(`📊 Scores for ${profile.externalId}: W=${wellbeingScore}, A=${activityScore}, S=${sleepScore}, M=${mentalHealthScore}, R=${readinessScore}`);

          return {
            ...profile,
            scores: {
              wellbeing: wellbeingScore,
              activity: activityScore,
              sleep: sleepScore,
              mentalHealth: mentalHealthScore,
              readiness: readinessScore
            },
            hasRealScores: !!(wellbeingScore || activityScore || sleepScore || mentalHealthScore || readinessScore)
          };
        } catch (scoreError) {
          console.log(`⚠️ Could not fetch scores for profile ${profile.externalId}:`, scoreError instanceof Error ? scoreError.message : scoreError);
          return {
            ...profile,
            scores: {
              wellbeing: null,
              activity: null,
              sleep: null,
              mentalHealth: null,
              readiness: null
            },
            hasRealScores: false
          };
        }
      })
    );

    const profilesWithRealScores = profilesWithScores.filter(p => p.hasRealScores);
    console.log(`✅ Successfully fetched scores for ${profilesWithRealScores.length}/${profiles.length} profiles`);

    return NextResponse.json({
      success: true,
      profiles: profilesWithScores,
      data: profilesWithScores,
      count: profilesWithScores.length,
      totalProfiles: profiles.length,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Profile fetching error:', error.message);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch profiles',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Helper function to get profile token for individual profile access
async function getProfileToken(accountToken: string, profile: SahhaProfile): Promise<string | null> {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_SAHHA_API_BASE_URL}/api/v1/oauth/profile/token`,
      {
        externalId: profile.externalId // Use externalId instead of profileId
      },
      {
        headers: {
          'Authorization': `Bearer ${accountToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.profileToken || response.data.token;
  } catch (error) {
    console.log(`⚠️ Failed to get profile token for ${profile.externalId}:`, error);
    return null;
  }
}

// Helper function to fetch individual profile scores using account token
async function fetchProfileScore(accountToken: string, externalId: string, scoreType: string): Promise<number | null> {
  try {
    // Try the account-level endpoint first: /api/v1/profile/score/{externalId}
    const response = await axios.get<ProfileScore[]>(
      `${process.env.NEXT_PUBLIC_SAHHA_API_BASE_URL}/api/v1/profile/score/${externalId}`,
      {
        headers: {
          'Authorization': `Bearer ${accountToken}`,
          'Content-Type': 'application/json'
        },
        params: {
          types: scoreType // Use types as string, not array!
        }
      }
    );

    const scores = response.data;
    if (scores && scores.length > 0) {
      // Return the most recent score (convert from 0-1 to 0-100 scale)
      const score = scores[scores.length - 1].score;
      return Math.round(score * 100); // Convert 0.86 -> 86
    }
    
    return null;
  } catch (error: any) {
    // Log the specific error for debugging
    if (error.response?.status === 400) {
      console.log(`⚠️ Score type "${scoreType}" validation error for ${externalId}`);
    } else if (error.response?.status === 404) {
      console.log(`⚠️ Profile or score not found for ${externalId}`);
    } else {
      console.log(`⚠️ Score fetch error for ${externalId}:`, error.response?.status);
    }
    return null;
  }
}