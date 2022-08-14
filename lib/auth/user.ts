import { NextApiRequest } from 'next';
import { verify, sign } from 'jsonwebtoken';
import { getUserById } from '../db/getters';

export const getUserFromReq = async (req: NextApiRequest) => {
	if (!req.headers.authorization) {
		return null;
	}

	const token = req.headers.authorization.split(' ')[1];
	return await getUserFromAuthToken(token);
};

export const getUserFromAuthToken = async (token: string) => {
	if (!token) {
		return null;
	}
	const payload = verifyUserJwt(token);
	if (!payload || !payload.userId) {
		return null;
	}
	return await getUserById(payload.userId);
};

export const verifyUserJwt = (token: string): { userId: string } | null => {
	if (!token) {
		return null;
	}

	if (!process.env.JWT_SECRET) {
		return null;
	}

	const payload = verify(token, process.env.JWT_SECRET);
	if (typeof payload === 'string') {
		return null;
	}

	const { userId, exp: expirationDate } = payload;

	if (!expirationDate) {
		return null;
	}

	if (new Date(expirationDate * 1000) < new Date()) {
		return null;
	}

	return { userId };
};

export const generateUserJwt = (userId: string): string => {
	const expiresInSeconds = 60 * 60 * 24 * 7;
	const issuer = 'notifyme-tansonlee';

	if (!userId) {
		throw new Error('userId must be provided');
	}

	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET must be set');
	}

	const payload = {
		userId,
	};

	return sign(payload, process.env.JWT_SECRET, {
		expiresIn: expiresInSeconds,
		issuer: issuer,
		subject: userId,
	});
};
