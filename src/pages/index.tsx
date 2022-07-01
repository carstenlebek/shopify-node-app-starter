import { Card, Layout, Page, TextContainer, TextStyle } from '@shopify/polaris';

import { GetProductsQuery } from '@graphql/generated';
import Head from 'next/head';
import { gql } from 'graphql-request';
import { useShopifyQuery } from 'src/hooks';

const PRODUCTS_QUERY = gql`
	query getProducts {
		products(first: 10) {
			nodes {
				id
				title
			}
		}
	}
`;

export default function AppHome() {
	const { data } = useShopifyQuery<GetProductsQuery>({
		key: 'products',
		query: PRODUCTS_QUERY,
	});
	console.log('🚀 ~ file: index.tsx ~ line 26 ~ AppHome ~ data', data);

	return (
		<>
			<Head>
				<title>Create Next Shopify App</title>
				<meta name='description' content='Template built by Carsten Lebek' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<Page title='Welcome to your Next.js Shopify App!'>
				<Layout>
					<Layout.Section>
						<TextContainer>
							<p>
								Get started by editing{' '}
								<TextStyle variation='code'>pages/index.tsx</TextStyle>
							</p>
						</TextContainer>
					</Layout.Section>
					<Layout.Section oneHalf>
						<Card
							sectioned
							title='Get data'
							actions={[
								{
									content: 'Get data',
									url: '/get-data',
								},
							]}
						>
							<TextContainer>
								<p>
									Fetch data from Shopify&apos;s GraphQL Api or from your own
									endpoint.
								</p>
							</TextContainer>
						</Card>
					</Layout.Section>
					<Layout.Section oneHalf>
						<Card
							sectioned
							title='Manage Billing'
							actions={[
								{
									content: 'Manage Billing',
									url: '/subscriptions',
								},
							]}
						>
							<TextContainer>
								<p>
									Subscribe Merchants to recurring plans and view active
									subscriptions.
								</p>
							</TextContainer>
						</Card>
					</Layout.Section>
					<Layout.Section oneHalf>
						<Card title='Documentation'>
							<Card.Section
								actions={[
									{
										content: 'Documentation',
										url: 'https://nextjs.org/docs',
									},
								]}
								title='Next.js'
							>
								<TextContainer>
									<p>
										Find in-depth information about Next.js features and API.
									</p>
								</TextContainer>
							</Card.Section>
						</Card>
					</Layout.Section>
					<Layout.Section oneHalf>
						<Card
							sectioned
							title='Deploy'
							actions={[
								{
									content: 'Deploy',
									url: 'https://vercel.com?utm_source=next-shopify-app&utm_medium=default-template&utm_campaign=next-shopify-app',
								},
							]}
						>
							<TextContainer>
								<p>
									Instantly deploy your Next.js site to a public URL with
									Vercel.
								</p>
							</TextContainer>
						</Card>
					</Layout.Section>
				</Layout>
			</Page>
		</>
	);
}
