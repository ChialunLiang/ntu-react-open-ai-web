const { initializeApp, applicationDefault, cert, getApps } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue, Filter } = require('firebase-admin/firestore');

// 定義金鑰
const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": "firebase-adminsdk-qpx0f@react-app-with-openai-3033f.iam.gserviceaccount.com",
    "client_id": "105591620845789483886",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-qpx0f%40react-app-with-openai-3033f.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

// FirebaseAdmin不可重複初始化，因此須先判斷是否有初始化過
if (getApps().length === 0) {
    // 初始化 Firebase Admim (驗證金鑰)
    initializeApp({
        credential: cert(serviceAccount)
    });
}

// db 定義資料庫並輸出
const db = getFirestore();
export default db;