import { notificationColumns } from '../../interface/notification';
import { fetchHasura } from './request';

export const insertUser = async ({ email }: { email: string }) => {
	const query = `
        mutation InsertUser($email: String!) {
            insert_user_one(object: {email: $email}) {
                created_at
                email
                id
                updated_at
            }
        }
    `;

	const variables = { email };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.insert_user_one;
};

export const insertNotification = async ({
	userId,
	title,
	body,
	type,
	groupId,
	link,
}: {
	userId: string;
	title: string;
	body: string;
	type: string;
	groupId: string;
	link?: string;
}) => {
	const query = `
        mutation InsertNotification($body: String!, $title: String!, $type: String!, $user_id: uuid!, $group_id: String!, $link: String) {
            insert_notification_one(object: {body: $body, title: $title, type: $type, user_id: $user_id, group_id: $group_id, link: $link}) {
                ${notificationColumns}
            }
        }
    `;

	const variables = { user_id: userId, group_id: groupId, title, body, type, link };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.insert_notification_one;
};
