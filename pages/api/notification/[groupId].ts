import { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromReq } from '../../../lib/auth/user';
import { getNotificationsByUserIdAndGroupId } from '../../../lib/db/getters';
import { cors, runMiddleware } from '../auth/get-token';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	await runMiddleware(req, res, cors);
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method not allowed' });
	}

	const user = await getUserFromReq(req);
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const { groupId } = req.query;

	const notifications = await getNotificationsByUserIdAndGroupId({
		userId: user.id,
		groupId: groupId as string,
	});

	return res.status(200).json({ notifications });
};

export default handler;
