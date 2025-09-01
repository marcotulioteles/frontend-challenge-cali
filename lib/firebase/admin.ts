import {
    getApps as getAdminApps,
    initializeApp as initializeAdminApp,
    cert,
    App,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";
import fs from "fs";
import path from "path";

function loadServiceAccount() {
    const envVar =
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
        process.env.FIREBASE_ACCOUNT_KEY;

    if (envVar) {
        let raw = envVar.trim();
        if (!raw.startsWith("{")) {
            try {
                raw = Buffer.from(raw, "base64").toString("utf-8").trim();
            } catch {
                throw new Error("Failed to base64-decode FIREBASE_SERVICE_ACCOUNT_KEY");
            }
        }

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON");
        }

        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed;
    }

    const localPath = path.join(process.cwd(), "secrets/firebase-admin.json");
    if (fs.existsSync(localPath)) {
        const parsed = JSON.parse(fs.readFileSync(localPath, "utf-8"));
        if (parsed.private_key) {
            parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed;
    }

    throw new Error(
        "Service account not found. Set FIREBASE_SERVICE_ACCOUNT_KEY (or FIREBASE_ACCOUNT_KEY) or add secrets/firebase-admin.json"
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
export const adminDb = getDatabase(adminApp);
