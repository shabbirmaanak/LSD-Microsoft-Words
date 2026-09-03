import { 
  isTursoConnected, 
  fetchTursoTemplates, 
  saveTursoTemplate, 
  deleteTursoTemplate 
} from './turso';
import { 
  isFirebaseConnected, 
  saveCloudTemplate, 
  deleteCloudTemplate, 
  subscribeToCloudTemplates 
} from './firebase';

export function getActiveCloudProvider() {
  if (isTursoConnected()) return 'turso';
  if (isFirebaseConnected()) return 'firebase';
  return 'none';
}

export async function syncAllCloudTemplates() {
  const provider = getActiveCloudProvider();
  if (provider === 'turso') {
    return await fetchTursoTemplates();
  }
  return [];
}

export async function saveToCloudDb(template) {
  const provider = getActiveCloudProvider();
  if (provider === 'turso') {
    return await saveTursoTemplate(template);
  } else if (provider === 'firebase') {
    return await saveCloudTemplate(template);
  }
  return null;
}

export async function deleteFromCloudDb(templateId) {
  const provider = getActiveCloudProvider();
  if (provider === 'turso') {
    return await deleteTursoTemplate(templateId);
  } else if (provider === 'firebase') {
    return await deleteCloudTemplate(templateId);
  }
  return null;
}
