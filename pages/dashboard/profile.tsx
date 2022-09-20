import {
	Box,
	Button,
	Flex,
	FormControl,
	FormErrorMessage,
	FormLabel,
	Heading,
	Icon,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Select,
	Stack,
	Table,
	TableCaption,
	TableContainer,
	Tbody,
	Td,
	Text,
	Textarea,
	Th,
	Thead,
	Tooltip,
	Tr,
	useDisclosure,
} from '@chakra-ui/react';
import { Field, Form, Formik } from 'formik';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { userAtom } from '../../atoms/auth';
import { HidableCopyableText } from '../../components/HidableCopyableText';
import { Layout } from '../../components/layouts';
import { authFetchUser } from '../../lib/auth/authFetchUser';
import { errorToast, successToast } from '../../lib/toast';
import { RiSendPlaneFill } from 'react-icons/ri';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { NotificationFragment, NotificationType } from '../../interface/notification';
import { format } from 'date-fns';
import { FiSend } from 'react-icons/fi';

type FormData = {
	title: string;
	body: string;
	type: NotificationType;
	groupId: string;
};

const Profile = () => {
	const user = useAtomValue(userAtom);
	const router = useRouter();
	const [notifications, setNotifications] = useState<NotificationFragment[]>([]);

	useEffect(() => {
		if (!user) {
			errorToast({ description: 'You are not logged in.' });
			router.push('/dashboard/login');
		}
	}, [router, user]);

	const fetchNotifications = async () => {
		const { notifications }: { notifications: NotificationFragment[] } = await authFetchUser({
			endpoint: `/api/notification/get-notifications`,
			method: 'GET',
		});

		const sortedNotifications = notifications.sort(
			(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
		);
		setNotifications(sortedNotifications);
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	return (
		<Layout>
			<Stack w={{ base: '90vw', md: '80vw' }} maxW='1200px' m='0 auto' spacing={10}>
				<Box>
					<Heading textAlign='center'>Welcome to Notifyr!</Heading>
					<Text textAlign='center'>
						Notifyr is the easiest way for you to notify your customers!
					</Text>
				</Box>
				<SendNotificationsSection refetchNotifications={fetchNotifications} />
				<DevelopersSection />
				<SentNotificationsSection notifications={notifications} />
			</Stack>
		</Layout>
	);
};

export default Profile;

const SendNotificationsSection = ({
	refetchNotifications,
}: {
	refetchNotifications: () => void;
}) => {
	const { onOpen, isOpen, onClose } = useDisclosure();

	const handleSubmit = async (formData: FormData) => {
		const response = await authFetchUser({
			endpoint: `/api/notification/insert-notification`,
			method: 'POST',
			body: formData,
		});

		refetchNotifications();
		onClose();
	};

	return (
		<Box bgColor='#f2f7fa' p={4} borderRadius='lg' boxShadow='lg' border='1px solid #efefef'>
			<Text fontSize='2xl' fontWeight='semibold'>
				Send Notifications
			</Text>
			<Text>Send notifications to your users right from the dashboard.</Text>
			<Text>
				Looking to programmatically send notifications? Use the{' '}
				<Link
					href='https://notifyr.readme.io/reference/getting-started-1'
					isExternal
					textDecor='underline'
				>
					SDK
				</Link>
				!
			</Text>
			<Button
				onClick={onOpen}
				colorScheme='blue'
				variant='outline'
				mt={2}
				leftIcon={<FiSend />}
			>
				SEND A NOTIFICATION
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Send a Notification</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<ContactForm handleSubmit={handleSubmit} />
					</ModalBody>
				</ModalContent>
			</Modal>
		</Box>
	);
};

const ContactForm = ({ handleSubmit }: { handleSubmit: (formData: FormData) => void }) => {
	const validateNotEmpty = (value: string) => {
		return !value.trim() ? 'This field is required' : undefined;
	};

	return (
		<Formik
			initialValues={
				{ title: '', body: '', type: NotificationType.INFO, groupId: '' } as FormData
			}
			onSubmit={(values, actions) => {
				handleSubmit(values);
				setTimeout(() => {
					actions.setSubmitting(false);
					successToast({
						description: 'Notification sent!',
					});
				}, 1000);
			}}
		>
			{props => (
				<Form>
					<Field name='title' validate={validateNotEmpty}>
						{({ field, form }: any) => (
							<FormControl
								mt={4}
								isInvalid={form.errors.title && form.touched.title}
								isRequired
							>
								<FormLabel htmlFor='title'>Title</FormLabel>
								<Input {...field} id='title' placeholder='Title' />
								<FormErrorMessage>{form.errors.title}</FormErrorMessage>
							</FormControl>
						)}
					</Field>

					<Field name='body' validate={validateNotEmpty}>
						{({ field, form }: any) => (
							<FormControl
								mt={4}
								isInvalid={form.errors.body && form.touched.body}
								isRequired
							>
								<FormLabel htmlFor='body'>Body</FormLabel>
								<Textarea {...field} id='body' placeholder='Body' />
								<FormErrorMessage>{form.errors.body}</FormErrorMessage>
							</FormControl>
						)}
					</Field>

					<Field name='type' validate={() => undefined}>
						{({ field, form }: any) => (
							<FormControl
								mt={4}
								isInvalid={form.errors.type && form.touched.type}
								isRequired
							>
								<Flex justify='space-between' align='center'>
									<FormLabel htmlFor='type'>Type</FormLabel>
									<Tooltip
										label='Determines the color of the notification in your users dashboard.'
										shouldWrapChildren
										hasArrow
										color='#fff'
									>
										<Icon as={AiOutlineInfoCircle} fontSize='xl' />
									</Tooltip>
								</Flex>
								<Select {...field} id='type'>
									{Object.values(NotificationType).map(type => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</Select>
								<FormErrorMessage>{form.errors.type}</FormErrorMessage>
							</FormControl>
						)}
					</Field>

					<Field name='groupId' validate={validateNotEmpty}>
						{({ field, form }: any) => (
							<FormControl
								mt={4}
								isInvalid={form.errors.groupId && form.touched.groupId}
								isRequired
							>
								<Flex justify='space-between' align='center'>
									<FormLabel htmlFor='groupId'>Group ID</FormLabel>
									<Tooltip
										label='Determines which user or group will receive this notification.'
										shouldWrapChildren
										hasArrow
										color='#fff'
									>
										<Icon as={AiOutlineInfoCircle} fontSize='xl' />
									</Tooltip>
								</Flex>
								<Input {...field} id='groupId' placeholder='Group ID' />
								<FormErrorMessage>{form.errors.groupId}</FormErrorMessage>
							</FormControl>
						)}
					</Field>

					<Box textAlign='center'>
						<Button
							mt={4}
							colorScheme='blue'
							isLoading={props.isSubmitting}
							type='submit'
							px={16}
							rightIcon={<RiSendPlaneFill />}
							rounded='3xl'
						>
							Submit
						</Button>
					</Box>
				</Form>
			)}
		</Formik>
	);
};

const DevelopersSection = () => {
	const user = useAtomValue(userAtom);

	if (!user) {
		return null;
	}

	return (
		<Box bgColor='#f2f7fa' p={4} borderRadius='lg' boxShadow='lg' border='1px solid #efefef'>
			<Text fontSize='2xl' fontWeight='semibold'>
				Developers
			</Text>
			<Link
				href='https://notifyr.readme.io/reference/getting-started-1'
				isExternal
				textDecor='underline'
			>
				Documentation
			</Link>
			<Text>
				You can use this API key for the Notifyr SDK and API. Be sure to keep this key safe;
				don&lsquo;t share it with anybody.
			</Text>
			<HidableCopyableText text={user.api_key} />
		</Box>
	);
};

const SentNotificationsSection = ({ notifications }: { notifications: NotificationFragment[] }) => {
	return (
		<Box bgColor='#f2f7fa' p={4} borderRadius='lg' boxShadow='lg' border='1px solid #efefef'>
			<Text fontSize='2xl' fontWeight='semibold'>
				Sent Notifications
			</Text>
			<TableContainer>
				<Table variant='simple'>
					<TableCaption>Notifications you&lsquo;ve sent.</TableCaption>
					<Thead>
						<Tr>
							<Th>Title</Th>
							<Th>Description</Th>
							<Th>Type</Th>
							<Th>Group ID</Th>
							<Th>Date</Th>
						</Tr>
					</Thead>
					<Tbody>
						{notifications.map(notification => (
							<Tr key={notification.id}>
								<Td>{shortenText(notification.title, 25)}</Td>
								<Td>{shortenText(notification.body, 40)}</Td>
								<Td>
									<Text
										bgColor={getBgColorForType(notification.type)}
										textAlign='center'
										p={1}
										borderRadius='lg'
										fontSize='sm'
									>
										{notification.type}
									</Text>
								</Td>
								<Td>{shortenText(notification.group_id, 10)}</Td>
								<Td>{format(new Date(notification.created_at), 'MMM q0, yyyy')}</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
		</Box>
	);
};

// Shorten text to show charactersToShow and add a tooltip with the full text
const shortenText = (text: string, charactersToShow: number) => {
	if (text.length <= charactersToShow) {
		return text;
	}

	return (
		<Tooltip label={text} hasArrow color='#fff'>
			<Text as='span' cursor='pointer'>
				{text.slice(0, charactersToShow)}...
			</Text>
		</Tooltip>
	);
};

const getBgColorForType = (type: NotificationType) => {
	switch (type) {
		case NotificationType.INFO:
			return 'blue.100';
		case NotificationType.SUCCESS:
			return 'green.100';
		case NotificationType.WARNING:
			return 'yellow.100';
		case NotificationType.ERROR:
			return 'red.100';
	}
};
