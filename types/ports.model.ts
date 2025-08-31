import { Session } from "./session.model";
import { Role, User } from "./user.model";

export interface AuthPort {
    signInWithEmailPassword(email: string, password: string): Promise<Session>;
    signOut(sessionId?: string): Promise<void>;
}

export interface SessionPort {
    issueSession(idToken: string): Promise<Session>;
    getSessionFromRequest(req: Request): Promise<Session | null>;
    refreshSession(req: Request): Promise<Session | null>;
    revokeSession(req: Request): Promise<void>;
}

export interface AuthorizationPort {
    userHasRole(user: User, role: Role): boolean;
}
