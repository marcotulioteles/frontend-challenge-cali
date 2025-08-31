import {
    getApps as getAdminApps,
    initializeApp as initializeAdminApp,
    cert,
    App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "fs";
import path from "path";

function loadServiceAccount() {
    const saFromEnv = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (saFromEnv) return JSON.parse(saFromEnv);

    const localPath = path.join(process.cwd(), "secrets/firebase-admin.json");
    if (fs.existsSync(localPath)) {
        return JSON.parse(fs.readFileSync(localPath, "utf-8"));
    }

    throw new Error(
        "Service account not found. Set FIREBASE_SERVICE_ACCOUNT_KEY or add secrets/firebase-admin.json"
    );
}

const serviceAccount = loadServiceAccount();

const adminApp: App =
    getAdminApps().length > 0
        ? getAdminApps()[0]!
        : initializeAdminApp({
            credential: cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL,
        });

export const adminAuth = getAuth(adminApp);
