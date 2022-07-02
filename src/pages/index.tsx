import { Card, Layout, Page, TextContainer, TextStyle } from '@shopify/polaris';

import Head from 'next/head';
import { TitleBar } from '@shopify/app-bridge-react';
import { useAppContext } from '@components/providers/AppContext';

export default function AppHome() {
	const { user } = useAppContext();

	return (
		<>
			<Head>
				<title>Create Next Shopify App</title>
				<meta name='description' content='Template built by Carsten Lebek' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<TitleBar
				title='Dashboard'
				breadcrumbs={{ content: 'Dashboard', url: '/' }}
			/>

			<Page
				title={`Hey ${user?.first_name}! Welcome to your typesafe Next.js Shopify App!`}
			>
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
									content: 'Demo',
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
									content: 'Demo',
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
							></Card.Section>
							<Card.Section
								actions={[
									{
										content: 'Documentation',
										url: 'https://shopify.dev/apps/tools/app-bridge',
									},
								]}
								title='Shopify App Bridge'
							></Card.Section>
							<Card.Section
								actions={[
									{
										content: 'Documentation',
										url: 'https://www.graphql-code-generator.com/docs/getting-started',
									},
								]}
								title='graphql-codegen'
							></Card.Section>
							<Card.Section
								actions={[
									{
										content: 'Documentation',
										url: 'https://trpc.io/docs',
									},
								]}
								title='tRPC'
							></Card.Section>
						</Card>
					</Layout.Section>
					<Layout.Section oneHalf>
						<Card
							sectioned
							title='Deploy'
							actions={[
								{
									content: 'Vercel',
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
