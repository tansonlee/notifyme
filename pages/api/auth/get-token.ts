import { Magic } from '@magic-sdk/admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateUserJwt } from '../../../lib/auth/user';
import { getUserByApiKey, getUserByEmail } from '../../../lib/db/getters';
import { insertUser } from '../../../lib/db/insert';

const magicAdmin = new Magic(process.env.MAGIC_SECRET_KEY);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	console.log('POST /api/auth/get-token');

	try {
		const { apiKey, didToken } = req.body;
		console.log({ didToken });

		if (!apiKey && !didToken) {
			return res.status(400).json({ error: 'No apiKey or didToken given' });
		}

		let userId: string | null = null;

		if (apiKey) {
			const user = await getUserByApiKey(apiKey);
			if (!user) {
				return res.status(401).json({ error: 'Invalid apiKey' });
			}
			userId = user.id;
		}

		if (didToken) {
			const { email } = await magicAdmin.users.getMetadataByToken(didToken);
			if (!email) {
				return res.status(401).json({ error: 'Invalid didToken' });
			}
			console.log({ email });
			let user = await getUserByEmail(email);
			console.log({ user });

			if (!user) {
				user = await insertUser({
					email,
				});
			}
			console.log({ user });
			userId = user.id;
		}

		if (!userId) {
			throw new Error('No userId');
		}

		console.log({ userId });

		const token = generateUserJwt(userId);
		console.log({ token });

		return res.status(200).json({ token });
	} catch (e) {
		console.log('Error /api/auth/get-token', e);
		return res.status(500).json({ error: e });
	}
};

export default handler;
