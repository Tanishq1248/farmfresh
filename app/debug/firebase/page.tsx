"use client";
import React, { useEffect, useState } from 'react';
import { getFirebaseStatus } from '@/lib/firebase';

export default function FirebaseDebug() {
  const [status, setStatus] = useState<any>(null);
  const [envVars, setEnvVars] = useState<any>(null);

  useEffect(() => {
    // Get Firebase status
    const firebaseStatus = getFirebaseStatus();
    setStatus(firebaseStatus);

    // Check environment variables
    const envCheck = {
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Set' : '❌ Missing',
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Set' : '❌ Missing',
    };
    
    setEnvVars(envCheck);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Firebase Configuration Debug</h1>

        {/* Firebase Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 Firebase Status</h2>
          {status ? (
            <div className="space-y-3">
              <div className={`p-3 rounded ${status.initialized ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className="font-semibold">{status.initialized ? '✅' : '❌'} Firebase App Initialized</p>
              </div>
              <div className={`p-3 rounded ${status.databaseReady ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className="font-semibold">{status.databaseReady ? '✅' : '❌'} Firebase Database Ready</p>
              </div>
              <div className={`p-3 rounded ${status.authReady ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className="font-semibold">{status.authReady ? '✅' : '❌'} Firebase Auth Ready</p>
              </div>
              {status.error && (
                <div className="p-3 rounded bg-red-100 border border-red-300">
                  <p className="font-semibold text-red-800">❌ Error: {status.error}</p>
                </div>
              )}
              <div className="p-3 rounded bg-blue-100 border border-blue-300 mt-4">
                <p className="font-semibold text-blue-800">Project: {status.config.projectId}</p>
                <p className="text-sm text-blue-700">Auth Domain: {status.config.authDomain}</p>
                <p className="text-sm text-blue-700">Database URL: {status.config.databaseURL}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Environment Variables */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔑 Environment Variables</h2>
          {envVars ? (
            <div className="space-y-2">
              {Object.entries(envVars).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                  <code className="text-sm font-mono text-gray-700">{key}</code>
                  <span className={`font-semibold ${String(value) === '✅ Set' ? 'text-green-600' : 'text-red-600'}`}>
                    {String(value)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Troubleshooting */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔧 Troubleshooting</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-bold text-lg mb-2">auth/internal-error - Solutions:</h3>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>1. Check .env.local file exists</strong> in your project root with all Firebase variables</li>
                <li><strong>2. Verify Firebase Project Settings:</strong>
                  <ul className="list-circle list-inside ml-4 mt-1">
                    <li>Go to Firebase Console → Your Project → Settings</li>
                    <li>Copy all values from "firebaseConfig"</li>
                    <li>Paste into .env.local file</li>
                  </ul>
                </li>
                <li><strong>3. Enable Email/Password Authentication:</strong>
                  <ul className="list-circle list-inside ml-4 mt-1">
                    <li>Go to Firebase Console → Authentication → Sign-in method</li>
                    <li>Click "Email/Password" and enable it</li>
                  </ul>
                </li>
                <li><strong>4. Restart your development server</strong> after updating .env.local</li>
                <li><strong>5. Clear browser cache</strong> (Ctrl+Shift+Del)</li>
                <li><strong>6. Check browser console</strong> for detailed error messages (F12 → Console)</li>
                <li><strong>7. Verify API Key permissions:</strong>
                  <ul className="list-circle list-inside ml-4 mt-1">
                    <li>Go to Google Cloud Console → APIs & Services</li>
                    <li>Verify Identity and Access Management (IAM) settings</li>
                  </ul>
                </li>
              </ul>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded">
              <h4 className="font-bold text-yellow-800 mb-2">⚠️ Important:</h4>
              <p className="text-yellow-700 text-sm">
                Never commit .env.local to Git. It contains sensitive API keys. Add it to .gitignore.
              </p>
            </div>
          </div>
        </div>

        {/* Browser Console Check */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 Next Steps</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Open Developer Tools (Press F12)</li>
            <li>Go to Console tab</li>
            <li>Refresh this page (Ctrl+R)</li>
            <li>Look for Firebase initialization messages (should see checkmarks ✅)</li>
            <li>Check for any error messages starting with ❌</li>
            <li>Share the console output if issues persist</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
