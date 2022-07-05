import {
	Card,
	EmptyState,
	IndexTable,
	Layout,
	Page,
	PageActions,
	Stack,
	TextStyle,
} from '@shopify/polaris';
import { TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import {
	useCreateSubscriptionMutation,
	useGetActiveSubscriptionsQuery,
} from '@graphql/generated';

import { Redirect } from '@shopify/app-bridge/actions';

export default function Subscriptions() {
	const app = useAppBridge();
	const redirect = Redirect.create(app);
	const returnUrl = `${process.env.HOST}/subscriptions`;

	const { mutateAsync: createSubscription } = useCreateSubscriptionMutation({
		onSuccess: (d) => {
			if (d?.appSubscriptionCreate?.confirmationUrl) {
				redirect.dispatch(
					Redirect.Action.REMOTE,
					d.appSubscriptionCreate.confirmationUrl
				);
			}
		},
	});

	const { data, isLoading } = useGetActiveSubscriptionsQuery(
		{},
		{
			onSuccess: (d) => console.log(d),
		}
	);

	return (
		<Page breadcrumbs={[{ content: 'Home', url: '/' }]} title='Manage Billing'>
			<TitleBar
				title='Manage Billing'
				breadcrumbs={{ content: 'Dashboard', url: '/' }}
			/>
			<Layout>
				<Layout.AnnotatedSection
					title='Create Subscription'
					description='Subscribe merchants to your apps subscripion plans.'
				>
					<Stack vertical>
						<Card
							sectioned
							title='Subscribe to 10$ Starter plan'
							primaryFooterAction={{
								content: 'Subscribe',
								onAction: () =>
									createSubscription({
										returnUrl,
										planName: 'Starter',
										planPrice: 10,
									}),
							}}
						/>
						<Card
							sectioned
							title='Subscribe to 30$ Premium plan'
							primaryFooterAction={{
								content: 'Subscribe',
								onAction: () =>
									createSubscription({
										returnUrl,
										planName: 'Premium',
										planPrice: 30,
									}),
							}}
						/>
						<Card
							sectioned
							title='Subscribe to 90$ Plus plan'
							primaryFooterAction={{
								content: 'Subscribe',
								onAction: () =>
									createSubscription({
										returnUrl,
										planName: 'Plus',
										planPrice: 90,
									}),
							}}
						/>
					</Stack>
				</Layout.AnnotatedSection>
				<Layout.AnnotatedSection title='Active Subscription'>
					<Card>
						<IndexTable
							loading={isLoading}
							emptyState={
								<EmptyState
									fullWidth
									heading='No active subscriptions'
									image='/undraw_make_it_rain_iwk4.png'
								></EmptyState>
							}
							resourceName={{
								singular: 'subscription',
								plural: 'subscriptions',
							}}
							itemCount={
								data?.appInstallation
									? data.appInstallation?.activeSubscriptions.length
									: 0
							}
							headings={[
								{ title: 'Planname' },
								{ title: 'Status' },
								{ title: 'Test' },
								{ title: 'Amount' },
							]}
							selectable={false}
						>
							{data?.appInstallation?.activeSubscriptions.map(
								({ name, status, test, lineItems }, index) => (
									<IndexTable.Row
										id={index.toString()}
										key={index}
										position={index}
									>
										<IndexTable.Cell>
											<TextStyle variation='strong'>{name}</TextStyle>
										</IndexTable.Cell>
										<IndexTable.Cell>{status}</IndexTable.Cell>
										<IndexTable.Cell>{test}</IndexTable.Cell>
										<IndexTable.Cell>
											{parseFloat(
												// @ts-ignore
												lineItems[0].plan.pricingDetails.price.amount
											).toLocaleString('en-US', {
												style: 'currency',
												currency:
													// @ts-ignore
													lineItems[0].plan.pricingDetails.price.currencyCode,
											})}
										</IndexTable.Cell>
									</IndexTable.Row>
								)
							)}
						</IndexTable>
					</Card>
				</Layout.AnnotatedSection>
			</Layout>
			<PageActions />
		</Page>
	);
}
