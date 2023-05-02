import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { clientSecret } = req.body;

	if (!clientSecret) {
		return res.status(400).json({ error: 'No clientSecret given' });
	}

	const decoded = decodeToken(clientSecret);

	if (decoded === null) {
		return res.status(400).json({ error: 'Invalid clientSecret' });
	}

	return res.status(200).json(decoded);
}

const decodeToken = (token: string): { groupId: string; apiKey: string } | null => {
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

	const { groupId, apiKey, exp: expirationDate } = payload;

	if (!expirationDate) {
		return null;
	}

	if (new Date(expirationDate * 1000) < new Date()) {
		return null;
	}

	return { groupId, apiKey };
};
