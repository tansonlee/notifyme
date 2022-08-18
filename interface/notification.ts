export type NotificationFragment = {
	id: string;
	user_id: string;
	title: string;
	body: string;
	type: NotificationType;
	created_at: string;
	updated_at: string;
	group_id: string;
	link?: string;
};

export enum NotificationType {
	INFO = 'INFO',
	SUCCESS = 'SUCCESS',
	WARNING = 'WARNING',
	ERROR = 'ERROR',
}

export const notificationColumns = 'id user_id title body type created_at updated_at group_id link';
