import { Box, Button, Flex, Heading, Icon, Link, Spinner, Stack, Text } from '@chakra-ui/react';
import { NotificationMenu } from '@notifyr/sdk';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { Layout } from '../components/layouts';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { BsCodeSlash } from 'react-icons/bs';
import { TbDeviceAnalytics } from 'react-icons/tb';
import { AiFillGithub } from 'react-icons/ai';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
	const [clientSecret, setClientSecret] = useState('');
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const response = await fetch(`/api/get-client-secret`);
			const result = await response.json();
			console.log('client secret', result);
			setClientSecret(result.clientSecret);
		})();
	}, []);

	return (
		<Box>
			<title>Notifyr</title>
			<Layout>
				<>
					<Heading mt={24} textAlign='center'>
						The easiest way to notify your customers.
					</Heading>
					<Flex mt={6} justify='center' align='center'>
						<Text fontSize='2xl' mr={4}>
							Try it out here
						</Text>
						<Icon as={BsArrowRight} fontSize='2xl' />
						<Box m={2}>
							{clientSecret ? (
								<NotificationMenu clientSecret={clientSecret} />
							) : (
								<Spinner />
							)}
						</Box>
						<Icon as={BsArrowLeft} fontSize='2xl' />
					</Flex>
					<Stack m='0 auto' w='fit-content' mt={20} spacing={8}>
						<Flex align='center' display='inline-flex'>
							<Icon as={BsCodeSlash} fontSize='4xl' mr={4} />
							<Box>
								<Text fontWeight='semibold'>Simple to integrate</Text>
								<Text>
									Integrate the Notifyr SDK into your app using our clear
									documentation.
								</Text>
							</Box>
						</Flex>
						<Flex align='center' display='inline-flex'>
							<Icon as={TbDeviceAnalytics} fontSize='4xl' mr={4} />
							<Box>
								<Text fontWeight='semibold'>Easy-to-use dashboard</Text>
								<Text>
									Send notifications to all your customers right from the
									dashboard.
								</Text>
							</Box>
						</Flex>
						<Flex align='center' display='inline-flex'>
							<Icon as={AiFillGithub} fontSize='4xl' mr={4} />
							<Box>
								<Text fontWeight='semibold'>Completely open-source</Text>
								<Text>
									The code is open source and available on GitHub for both the SDK
									and APIs.
								</Text>
							</Box>
						</Flex>
					</Stack>
					<Flex justify='center' align='center' mt={20}>
						<Button
							colorScheme='whatsapp'
							onClick={() => router.push('/dashboard/login')}
							mr={4}
						>
							GET STARTED
						</Button>
						<Link
							href='https://notifyr.readme.io/reference/getting-started-1'
							isExternal
						>
							DOCUMENTATION
						</Link>
					</Flex>
				</>
			</Layout>
		</Box>
	);
};

export default Home;
