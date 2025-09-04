// Deprecated: Firebase config now lives in environment.{ts|development.ts} under environment.firebase.
// This file is kept temporarily to avoid import errors if any stale references remain.
// Remove once all imports point to: import { environment } from '../environments/environment';
export { environment as firebaseEnvironment } from './environment';
export const firebaseConfig = (typeof window !== 'undefined' ? (window as any).firebaseConfig : undefined) || ({} as any);
