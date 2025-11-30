import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB4xj3LrXMOfUZfytFZA3RILrZ0lgEfF3A",
  authDomain: "chatrooms-2f5bc.firebaseapp.com",
  projectId: "chatrooms-2f5bc",
  storageBucket: "chatrooms-2f5bc.appspot.com",
  messagingSenderId: "998170279518",
  appId: "1:998170279518:web:f7a302a4da160f15e5becf",
  measurementId: "G-26HY49WL31"
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export const uploadFileToFirebase = async (file: File) => {
  const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`)

  await uploadBytes(fileRef, file);

  const downloadURL = await getDownloadURL(fileRef)

  return downloadURL;
}