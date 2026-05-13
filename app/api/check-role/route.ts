import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

export async function GET(req: Request) {
  let uid: string | null = null;
  
  try {
    // Parse URL and extract uid
    const { searchParams } = new URL(req.url);
    uid = searchParams.get('uid');

    console.log('[check-role API] Request received - uid:', uid);

    // Validate UID is provided and not empty
    if (!uid || uid.trim() === '') {
      console.warn('[check-role API] Missing or empty UID');
      return NextResponse.json(
        { role: 'USER', default: true, reason: 'no-uid' },
        { status: 200 }
      );
    }

    try {
      // Query Firestore - fetch user document
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);

      // User document exists - extract role
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData?.role || 'USER';
        console.log('[check-role API] ✓ User found - role:', role);
        return NextResponse.json(
          { role, default: false, found: true },
          { status: 200 }
        );
      }

      // User document not found
      console.warn('[check-role API] User document not found - uid:', uid);
      return NextResponse.json(
        { role: 'USER', default: true, reason: 'user-not-found' },
        { status: 200 }
      );
    } catch (fbError) {
      // Handle Firebase/Firestore specific errors
      if (fbError instanceof FirebaseError) {
        const code = fbError.code || 'unknown';
        const message = fbError.message || '';
        
        console.error('[check-role API] Firebase error:', { code, message, uid });

        // Permission denied - return safe default
        if (code === 'permission-denied') {
          console.warn('[check-role API] ⚠ Permission denied - Check Firestore security rules allow read for uid:', uid);
          return NextResponse.json(
            { role: 'USER', default: true, reason: 'permission-denied' },
            { status: 200 }
          );
        }

        // Network or other Firebase errors - return safe default
        console.error('[check-role API] Firebase operation failed:', code);
        return NextResponse.json(
          { role: 'USER', default: true, reason: `firebase-${code}` },
          { status: 200 }
        );
      }

      // Non-Firebase error
      console.error('[check-role API] Unexpected error in Firestore query:', fbError);
      return NextResponse.json(
        { role: 'USER', default: true, reason: 'unknown-error' },
        { status: 200 }
      );
    }
  } catch (error) {
    // Top-level error handler - something went very wrong
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[check-role API] CRITICAL ERROR:', { errorMsg, uid });
    
    // Still return valid JSON - never crash with 500
    return NextResponse.json(
      { role: 'USER', default: true, reason: 'critical-error' },
      { status: 200 }
    );
  }
}
