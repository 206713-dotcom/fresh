import {firebaseConfig} from './firebase-config.js';

// Student IDs are never written as plaintext to Firestore or shown in profiles.
// This demonstration maps a normalized student ID to a stable, non-deliverable
// Firebase Auth email alias. It does NOT verify that an ID belongs to a student;
// real school use needs verified provisioning and an account recovery process.
const SDK = 'https://www.gstatic.com/firebasejs/12.19.0/';
const required = ['apiKey', 'authDomain', 'projectId', 'appId'];
export const authConfigured = required.every(key =>
  typeof firebaseConfig[key] === 'string' &&
  firebaseConfig[key].trim() &&
  !firebaseConfig[key].includes('YOUR_')
);
let auth = null;
let authSdk = null;

export function normalizeStudentId(value) {
  return String(value || '').trim().toUpperCase();
}
export function validStudentId(value) {
  return /^[A-Z0-9_-]{4,24}$/.test(normalizeStudentId(value));
}

// Detect a school-style password such as: digit(s) + CapitalizedWord + symbol.
// Warn and require a DIFFERENT password without echoing or storing it.
export function looksLikeSchoolPassword(value) {
  const p = String(value || '');
  return /^\d+[A-Z][a-z]{3,}[^\p{L}\p{N}]$/u.test(p) ||
         /^[A-Z][a-z]{3,}\d+[^\p{L}\p{N}]$/u.test(p);
}

export function validateNewPassword(value, confirmation, studentId) {
  if (looksLikeSchoolPassword(value)) {
    return 'This might be your school password. Please choose a different password just for PyQuest.';
  }
  if (value.length < 12) return 'Use at least 12 characters for your new password.';
  if (value.length > 128) return 'Use a password of 128 characters or fewer.';
  if (value.toUpperCase().includes(normalizeStudentId(studentId)) && validStudentId(studentId)) {
    return 'Do not include your student ID in your password.';
  }
  if (value !== confirmation) return 'The two passwords do not match.';
  return '';
}

async function accountAlias(studentId) {
  if (!validStudentId(studentId)) throw new Error('Use your student ID (4–24 letters, numbers, _ or -).');
  // Hash prevents storing the visible ID as the Firebase Auth email. This is NOT
  // a secret or proof of student identity, and hashed IDs can still be guessed.
  const input = new TextEncoder().encode('pyquest-student-login-v1:' + normalizeStudentId(studentId));
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', input));
  const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
  return 'student-' + hex + '@login.pyquest.invalid';
}

export async function initializeLogin(onChange, onError) {
  if (!authConfigured) { onChange(null); return; }
  try {
    const {initializeApp} = await import(SDK + 'firebase-app.js');
    authSdk = await import(SDK + 'firebase-auth.js');
    auth = authSdk.getAuth(initializeApp(firebaseConfig));
    authSdk.onAuthStateChanged(auth, async account => {
      if (account && !account.providerData.some(p => p.providerId === 'password')) {
        // The new site uses student-ID/password accounts only, not old Google sessions.
        await authSdk.signOut(auth);
        onChange(null);
        return;
      }
      onChange(account);
    }, onError);
  } catch (error) { onError(error); }
}
function requireAuth() {
  if (!authConfigured) throw new Error('Website owner: configure Firebase in firebase-config.js first.');
  if (!auth || !authSdk) throw new Error('Account system is loading. Try again.');
}
export async function signUpStudent(studentId, password, confirmation) {
  requireAuth();
  if (!validStudentId(studentId)) throw new Error('Enter your student ID (4–24 letters, numbers, _ or -).');
  const issue = validateNewPassword(password, confirmation, studentId);
  if (issue) throw new Error(issue);
  const email = await accountAlias(studentId);
  await authSdk.createUserWithEmailAndPassword(auth, email, password);
}
export async function signInStudent(studentId, password) {
  requireAuth();
  const email = await accountAlias(studentId);
  await authSdk.signInWithEmailAndPassword(auth, email, password);
}
export async function signInAdmin(email,password) {
  requireAuth();
  const staffEmail=String(email||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staffEmail))
    throw new Error('Enter the staff email provided by the school.');
  await authSdk.signInWithEmailAndPassword(auth,staffEmail,password);
  // Firestore verifies approved admin status after login; password alone grants
  // no admin access, even if this Firebase account exists.
}
export async function signOutStudent() {
  if (auth && authSdk) await authSdk.signOut(auth);
}
export function friendlyAuthError(error) {
  const code = error?.code || '';
  if (code === 'auth/operation-not-allowed') return 'Website owner: enable Email/Password in Firebase Authentication.';
  if (code === 'auth/email-already-in-use') return 'An account with that student ID already exists. Try logging in.';
  if (code === 'auth/invalid-email') return 'Account setup error. Ask the website owner for help.';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') return 'Student ID or password is incorrect.';
  if (code === 'auth/weak-password') return 'Choose a stronger password, at least 12 characters.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Try again later or ask a teacher for help.';
  if (code === 'auth/network-request-failed') return 'Connection failed. Check your internet.';
  if (code === 'auth/invalid-api-key') return 'Website owner: check firebase-config.js.';
  return error?.message || 'Could not access your account.';
}

// Change an existing password only after verifying the old password with Firebase.
export async function changeOwnPassword(oldPassword,newPassword,confirmation){
  requireAuth();
  const account=auth.currentUser;
  if(!account || !account.email)throw Error('Log in first.');
  const issue=validateNewPassword(newPassword,confirmation,'');
  if(issue)throw Error(issue);
  if(!oldPassword)throw Error('Enter your current password.');
  if(oldPassword===newPassword)throw Error('Choose a new password different from your current one.');
  const credential=authSdk.EmailAuthProvider.credential(account.email,oldPassword);
  await authSdk.reauthenticateWithCredential(account,credential);
  await authSdk.updatePassword(account,newPassword);
}
// Admin email addresses are real deliverable accounts, unlike student-ID aliases.
export async function sendStaffResetEmail(email){
  requireAuth();
  const value=String(email||'').trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))throw Error('Enter your staff email first.');
  await authSdk.sendPasswordResetEmail(auth,value);
}
