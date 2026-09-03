import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const STORAGE_KEY = 'al_kitabah_firebase_config';

export function getStoredFirebaseConfig() {
  try {
    const custom = localStorage.getItem(STORAGE_KEY);
    if (custom) {
      return JSON.parse(custom);
    }
  } catch (e) {
    console.warn('Failed to read custom Firebase config', e);
  }

  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return null;
}

export function saveStoredFirebaseConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    initFirebase();
  } catch (e) {
    console.error('Failed to save Firebase config', e);
  }
}

let dbInstance = null;

export function initFirebase() {
  const config = getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    dbInstance = null;
    return null;
  }

  try {
    const app = getApps().length > 0 ? getApp() : initializeApp(config);
    dbInstance = getFirestore(app);
    return dbInstance;
  } catch (err) {
    console.warn('Firebase initialization error:', err);
    dbInstance = null;
    return null;
  }
}

export function getDb() {
  if (!dbInstance) {
    return initFirebase();
  }
  return dbInstance;
}

export function isFirebaseConnected() {
  return getDb() !== null;
}

// 1. Subscribe to Real-Time Cloud Templates
export function subscribeToCloudTemplates(onUpdate, onError) {
  const db = getDb();
  if (!db) return () => {};

  try {
    const tplsRef = collection(db, 'templates');
    const unsubscribe = onSnapshot(tplsRef, (snapshot) => {
      const templates = [];
      snapshot.forEach((docSnap) => {
        templates.push({ id: docSnap.id, ...docSnap.data() });
      });
      onUpdate(templates);
    }, (err) => {
      console.warn('Cloud templates snapshot error:', err);
      if (onError) onError(err);
    });
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to subscribe to cloud templates:', err);
    return () => {};
  }
}

// 2. Save / Publish Template to Cloud
export async function saveCloudTemplate(template) {
  const db = getDb();
  if (!db) throw new Error('Cloud Database is not configured.');

  const tplId = template.id || 'tpl_' + Date.now();
  const tplRef = doc(db, 'templates', tplId);
  const dataToSave = {
    title: template.title,
    category: template.category || 'Official',
    description: template.description || '',
    content: template.content || '',
    watermark: template.watermark || '',
    updatedAt: Date.now()
  };

  await setDoc(tplRef, dataToSave, { merge: true });
  return { id: tplId, ...dataToSave };
}

// 3. Delete Template from Cloud
export async function deleteCloudTemplate(templateId) {
  const db = getDb();
  if (!db) throw new Error('Cloud Database is not configured.');

  const tplRef = doc(db, 'templates', templateId);
  await deleteDoc(tplRef);
}
