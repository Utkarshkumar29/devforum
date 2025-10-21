{/*const admin = require("firebase-admin");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

console.log("Firebase key path:", process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

const serviceAccount = JSON.parse(
  fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      ...serviceAccount,
      private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET)
module.exports = { bucket, admin }
*/}