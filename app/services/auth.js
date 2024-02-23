import firebase from './firebase-config';

// Sign Up Function
export const signUp = async (email, password) => {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
};

// Sign In Function
export const signIn = async (email, password) => {
  await firebase.auth().signInWithEmailAndPassword(email, password);
};

// Sign Out Function
export const signOut = async () => {
  await firebase.auth().signOut();
};

// Function to monitor user state
export const onAuthStateChanged = (onChange) => {
  return firebase.auth().onAuthStateChanged(user => {
    onChange(user);
  });
};
