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
}: {
	userId: string;
	title: string;
	body: string;
	type: string;
}) => {
	const query = `
        mutation InsertNotification($body: String!, $title: String!, $type: String!, $user_id: uuid!) {
            insert_notification_one(object: {body: $body, title: $title, type: $type, user_id: $user_id}) {
                body
                created_at
                id
                title
                type
                updated_at
                user_id
            }
        }
    `;

	const variables = { user_id: userId, title, body, type };

	const response = await fetchHasura(query, variables);
	console.log('response', response);
	return response.data.insert_notification_one;
};
