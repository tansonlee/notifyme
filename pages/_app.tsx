import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
import { initializeApollo } from '../lib/apollo';
import theme from '../theme';
import Head from 'next/head';

const { ToastContainer } = createStandaloneToast();

function MyApp({ Component, pageProps }: AppProps) {
	const client = initializeApollo();
	return (
		<ChakraProvider theme={theme}>
			<Head>
				<meta name='description' content='Easiest way to notify your customers.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Component {...pageProps} />
			<ToastContainer />
		</ChakraProvider>
	);
}

export default MyApp;
