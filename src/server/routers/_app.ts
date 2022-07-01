/**
 * This file contains the root router of your tRPC-backend
 */
import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { z } from 'zod';

/**
 * Create your application's root router
 * If you want to use SSG, you need export this
 * @link https://trpc.io/docs/ssg
 * @link https://trpc.io/docs/router
 */
export const appRouter = createRouter()
	/**
	 * Add data transformers
	 * @link https://trpc.io/docs/data-transformers
	 */
	.transformer(superjson)
	/**
	 * Optionally do custom error (type safe!) formatting
	 * @link https://trpc.io/docs/error-formatting
	 */
	// .formatError(({ shape, error }) => { })
	/**
	 * Add a health check endpoint to be called with `/api/trpc/healthz`
	 */
	.query('healthz', {
		async resolve() {
			return 'yay!';
		},
	})
	.query('hello', {
		input: z
			.object({
				text: z.string().nullish(),
			})
			.nullish(),
		resolve({ input }) {
			return {
				greeting: `Hello ${input?.text ? input.text : 'world'}`,
			};
		},
	});

export type AppRouter = typeof appRouter;
