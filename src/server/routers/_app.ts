import { TRPCError } from '@trpc/server';
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
	// this protects all procedures defined next in this router
	.middleware(async ({ ctx, next }) => {
		if (!ctx.session) {
			throw new TRPCError({ code: 'UNAUTHORIZED' });
		}
		return next();
	})
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
	})
	.query('currentUser', {
		resolve({ ctx }) {
			return ctx.session?.onlineAccessInfo?.associated_user;
		},
	});

export type AppRouter = typeof appRouter;
