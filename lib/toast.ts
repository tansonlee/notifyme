import {
	createStandaloneToast,
	ToastPosition,
	ToastPositionWithLogical,
	useToast,
} from '@chakra-ui/react';

const { toast } = createStandaloneToast();

export const errorToast = ({
	description,
	title = '',
	position = 'top',
	durationInMiliseconds = 5 * 1000,
}: {
	description: string;
	title?: string;
	durationInMiliseconds?: number | null;
	position?: ToastPosition;
}) => {
	toast({
		status: 'error',
		title,
		description,
		position,
		duration: durationInMiliseconds,
		isClosable: true,
	});
};
