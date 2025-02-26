import admin from 'firebase-admin';

if (!admin.apps.length) {
    try{
        admin.initializeApp();
    } catch (error) {
        console.error("Firebase admin initialization error", error.stack);
    }
}


export const db = admin.firestore();
export const auth = admin.auth();