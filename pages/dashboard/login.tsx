import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userEmailAtom } from '../../atoms/auth';
import { PROFILE_ROUTE } from '../../interface/routes';
import { initializeMagicLink } from '../../lib/magiclink';
import { errorToast } from '../../lib/toast';

const Login = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [, setUserEmail] = useAtom(userEmailAtom);

	const handleSubmit = async () => {
		const magic = initializeMagicLink();
		const isAlreadyLoggedIn = await magic.user.isLoggedIn();
		if (!isAlreadyLoggedIn) {
			await magic.auth.loginWithMagicLink({ email });
		}
		const userMetadata = await magic.user.getMetadata();
		if (!userMetadata.email) {
			errorToast({ description: 'Error loggin in.' });
			return;
		}
		setUserEmail(userMetadata.email);
		router.push(PROFILE_ROUTE);
	};

	return (
		<Box>
			<Heading textAlign='center'>Login to NotifyMe</Heading>

			<Box w='50%' m='0 auto' mt={8}>
				<Stack>
					<Text textAlign='center' fontSize='lg'>
						Email
					</Text>
					<Input
						placeholder='richard@piedpiper.com'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<Button onClick={handleSubmit}>Submit</Button>
				</Stack>
			</Box>
		</Box>
	);
};

export default Login;
