import firebase from 'firebase'
import * as firebaseAdmin from 'firebase-admin';

const {
  FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_DATABASE_URL,
  FIREBASE_PRIVATE_KEY
} = process.env

// admin
const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY
  }),
  databaseURL: FIREBASE_DATABASE_URL
});

// client
var config = {
  apiKey: "AIzaSyBHZZ3w1RE_Uhornl0jGOpgZxtbeLg-ka0",
  authDomain: "habit-app-f89b8.firebaseapp.com",
  databaseURL: "https://habit-app-f89b8.firebaseio.com",
  storageBucket: "habit-app-f89b8.appspot.com",
};
firebase.initializeApp(config);

const {
  FIREBASE_TEST_EMAIL,
  FIREBASE_TEST_PASSWORD,
  FIREBASE_TEST_UID
} = process.env;

export async function createTestUser() {
  // create a firebase test user
  try {
    await admin.auth().createUser({
      uid: FIREBASE_TEST_UID,
      email: FIREBASE_TEST_EMAIL,
      emailVerified: false,
      phoneNumber: "+11234567890",
      password: FIREBASE_TEST_PASSWORD,
      displayName: "John Doe",
      photoURL: "http://www.example.com/12345678/photo.png",
      disabled: false
    })
    console.log("Successfully created new user:");
  } catch (error) {
    console.log("Error creating new user:", error);
  }
}

export async function updateTestUser(options) {
  admin.auth().updateUser(FIREBASE_TEST_UID, {...options})
  try {
    await admin.auth().updateUser(FIREBASE_TEST_UID, {
      emailVerified: true
    })
    console.log("Successfully created new user:");
  } catch (error) {
    console.log("Error updating user:", error);
    throw new Error(error.message);
  }
}

export async function deleteTestUser() {
  // Delete created user
  try {
    await admin.auth().deleteUser(FIREBASE_TEST_UID)  
    console.log("Successfully deleted user");
  } catch (error) {
    console.log("Error deleting user:", error);
  }
}

export async function loginClient() {
  // using the client, login and get a token
  await firebase.auth().signInWithEmailAndPassword(FIREBASE_TEST_EMAIL, FIREBASE_TEST_PASSWORD)
}

export async function setClientToken() {
  const token = await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true)
  process.env.AUTH_CLIENT_ACCESS_TOKEN = token;
}
