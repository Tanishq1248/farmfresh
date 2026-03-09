import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Collect Firebase configuration status info
    const firebaseEnv = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? '✅ Set' : '❌ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
    };

    // Check if all required env vars are present
    const allSet = Object.values(firebaseEnv).every(val => val === '✅ Set');

    return NextResponse.json({
      status: allSet ? 'ready' : 'incomplete',
      message: allSet 
        ? 'Firebase configuration is complete' 
        : 'Firebase configuration is incomplete. Check .env.local file.',
      environment: firebaseEnv,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'Not set',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to check Firebase configuration',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
