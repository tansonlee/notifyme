export type UserFragment = {
	id: string;
	email: string;
	created_at: string;
	updated_at: string;
	api_key: string;
};

export const userColumns = 'id email created_at updated_at api_key';
