import NextAuth, { DefaultSession, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { authConfig } from "./auth.config";
import { v4 as uuidv4 } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";
import { client } from "./lib/prisma";
import { signInSchema } from "./types/signInSchema";
import { checkUser } from "./actions/authUser";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // jwt: {
  //   encode: async function (params) {
  //     if (params.token?.credentials) {
  //       const sessionToken = uuidv4();
  //       if (!params.token.sub) {
  //         throw new Error("No User found in the token");
  //       }

  //       if (!adapter || !adapter.createSession) {
  //         throw new Error("Adapter not found");
  //       }

  //       const createdSession = await adapter.createSession({
  //         sessionToken,
  //         userId: params.token.sub,
  //         expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  //       });
  //       if (!createdSession) {
  //         throw new Error("Session not created");
  //       }
  //       return sessionToken;
  //     }
  //     return defaultEncode(params);
  //   },
  // },
  session:{
    strategy: "jwt"
  },
  trustHost: true,
  
  adapter: PrismaAdapter(client),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const isValid = signInSchema.safeParse(credentials);
          if (!isValid.success) {
            return null;
          }
          const { email, password } = isValid.data
          console.log(email,password)
          const res = await checkUser(email, password);
          if (res.success && res.data) {
            return {
              id: res.data.id,
              email: res.data.email,
              name: res.data.name,
              image: res.data.image
            } as User
          }
          console.log(res)

          return null;
        } catch (err) {
          console.error("Authorization failed:", err);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET
});
