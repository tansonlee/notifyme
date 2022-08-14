export const fetchHasura = async (query: string, variables?: any) => {
	try {
		if (!process.env.HASURA_ADMIN_SECRET || !process.env.HASURA_URL) {
			throw new Error('HASURA_ADMIN_SECRET and HASURA_URL must be set');
		}

		const headers = {
			'Content-Type': 'application/json',
			'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
			'Cache-Control': 'no-cache',
		};

		const body = JSON.stringify({
			query,
			variables,
		});

		const options = {
			method: 'POST',
			headers,
			body,
		};

		const response = await fetch(process.env.HASURA_URL, options);
		const responseJson = await response.json();
		console.log('responseJson', responseJson);
		if (responseJson.error || responseJson.errors) {
			return { error: responseJson.error || responseJson.errors };
		}
		return { data: responseJson.data };
	} catch (e) {
		console.log('Error fetchHasura:', e);
		return { error: e };
	}
};
