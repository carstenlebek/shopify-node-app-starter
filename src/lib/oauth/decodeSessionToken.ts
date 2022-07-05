// import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';
const JWT_PERMITTED_CLOCK_TOLERANCE = 5;

interface JwtPayload {
	iss: string;
	dest: string;
	aud: string;
	sub: string;
	exp: number;
	nbf: number;
	iat: number;
	jti: string;
	sid: string;
}

interface JwtHeader {
	alg: string;
	typ: string;
}

/**
 * Decodes the given session token, and extracts the session information from it
 *
 * @param token Received session token
 */
function decodeSessionToken(token: string): JwtPayload {
	let payload: JwtPayload;
	try {
		var decoded: JwtPayload = jwt_decode(token);
		var decodedHeader: JwtHeader = jwt_decode(token, { header: true });

		console.log('JWT', decoded);
		console.log('JWT HEADER', decodedHeader);

		// TODO: Verify JWT Token

		payload = decoded;

		// payload = jwt.verify(token, process.env.SHOPIFY_API_SECRET_KEY, {
		// 	algorithms: ['HS256'],
		// 	clockTolerance: JWT_PERMITTED_CLOCK_TOLERANCE,
		// }) as JwtPayload;
	} catch (error: any) {
		throw `Failed to parse session token '${token}': ${error.message}`;
	}

	// The exp and nbf fields are validated by the JWT library

	if (payload.aud !== process.env.SHOPIFY_API_KEY) {
		throw 'Session token had invalid API key';
	}

	return payload;
}

export default decodeSessionToken;

export { decodeSessionToken };

export type { JwtPayload };
