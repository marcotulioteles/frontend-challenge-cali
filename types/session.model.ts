import { User } from "./user.model"

export type Session = {
    user: User;
    expiresAt: number;
}