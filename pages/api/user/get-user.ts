import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromReq } from '../../../lib/auth/user';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}
	console.log('GET /api/user/get-user');

	try {
		const user = await getUserFromReq(req);
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		return res.status(200).json({ user });
	} catch (e) {
		console.log('Error /api/user/get-user', e);
		return res.status(500).json({ error: e });
	}
};

export default handler;
