import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

// import { createLogger } from "../../utils/logger"; // winston logger

import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JwtToken";
// import { Jwt } from "../../auth/Jwt";

// const logger = createLogger("auth");

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJXyjEZu7dXaJ9MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi01aXR4ajlnci51cy5hdXRoMC5jb20wHhcNMjAwNjI4MjI0ODQyWhcN
MzQwMzA3MjI0ODQyWjAkMSIwIAYDVQQDExlkZXYtNWl0eGo5Z3IudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyWK15k4NbL0vSHXQ
NGGk4DjO12wfNEe8JCABA7RYrCSOa0xkxDPOUsqMglI1NmXevI2bO++76FIQQjnc
2Mkb2A6VePfUeg4qKVa0HSVNWqr1CFhSzvjqr/0bvzdAsUjYHP6CpT9LPA1z63qD
oyJS73CSuRPB5eqQAzIzzuvAak0ohwanQJ9eyulvyBJAxTXKyFC9NQY6rbCjOoIL
FKvC1mYYr7dlR2bot6LABtLsJIA1yZAxv0JTXUqd9n+ruzlHtWBEIdNq47cYS49s
2St1uGeh/cFyAc7nu+VJs3PyBwPoaLgG87tXf0qDEilDRcBzh8hrH/uEaKzfapfc
R6elKwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ6klIqMZzP
R4AZnxMfV+kvj469MzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AFI8Be6aPg9Ao5G3GI/vlJFpFpLaSKSrEB3f15OZsCbpShp671Cj55qGhg1pzC/e
5SXzaIFHv1OzNcCR1NXIw4HAQCXH+yb1yeY6WPHlS2SfM69CVxzvv1pXrKGfgOdr
d7bkzx5qQpE1Ghkq2wCWrO1kRH0mB1EwjFwKC14hnsUxbhjHltKybA5OTOqDP9kZ
49IpToRBjZqT420xYOZDh/J8wygWu0k/HOa7edjrOcfJjYRLsfr/EbdXidHg0GD0
/1y1UGHRHXSxOOeUqUtd6gby5woLata7IclzUN9KdX6uSpekL3zTTrNoZyq0PW8b
3C6KZvn71v9+qu9kUSUkX/4=
-----END CERTIFICATE-----`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  // logger.info("Authorizing a user", event.authorizationToken);

  try {
    // verified passed in token from event Auth Header
    const jwtToken = await verifyToken(event.authorizationToken);
    console.log("User was authorized", jwtToken);

    return {
      principalId: jwtToken.sub, // user id
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    console.log("User not authorized", { error: e.message });

    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return verify(token, cert, { algorithms: ["RS256"] }) as JwtToken;
}
