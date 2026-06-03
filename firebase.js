import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyDKlaU8pa1i79o3HrOXGxrUaP9ETDs8mwY",
authDomain: "sistemacautela3gacap.firebaseapp.com",
projectId: "sistemacautela3gacap",
storageBucket: "sistemacautela3gacap.firebasestorage.app",
messagingSenderId: "867745045769",
appId: "1:867745045769:web:d732506942bec6e0f6c7d8"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.addDoc = addDoc;
window.getDocs = getDocs;

console.log("Firebase conectado!");

import {
getFirestore,
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.deleteDoc = deleteDoc;
window.doc = doc;
