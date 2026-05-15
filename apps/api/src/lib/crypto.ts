import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16).toString("hex");
	const hash = (await scryptAsync(password, salt, 64)) as Buffer;
	return `${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(
	password: string,
	storedHash: string,
): Promise<boolean> {
	const [salt, hash] = storedHash.split(":");
	const hashBuffer = Buffer.from(hash, "hex");
	const derivedHash = (await scryptAsync(password, salt, 64)) as Buffer;
	return timingSafeEqual(hashBuffer, derivedHash);
}

export function generateRefreshToken(): string {
	return randomBytes(32).toString("hex");
}

export function hashRefreshToken(token: string): string {
	return createHash("sha256").update(token).digest("hex");
}
