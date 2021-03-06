import { decode } from "jsonwebtoken";

import { JwtToken } from "./JwtToken";

// parse JWT token and return its payload

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT Token to parse
 * @param a user id from the JWT token
 */

export function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken;
  return decodedJwt.sub; // sub is the user ID passed with Auth0
}
