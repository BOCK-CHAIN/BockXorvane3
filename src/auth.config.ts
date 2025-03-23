import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string
    };
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/",
    error: "/",
    newUser: "/auth/sign-up",
  },
  callbacks: {
    signIn({ user, account, profile, email, credentials }) {
      if (user) {
        return true;
      }
      return false;
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
    jwt({ token, user, account,trigger,session }) {
      if(trigger === "update"){
        return {...token, ...session.user}
      }

      if (account?.provider === "credentials") {
        if (user) {
          token.sub = user.id;
          token.name = user.name;
          token.email = user.email;
          token.image = user.image;
        }
        
        token.credentials = true;
      }
      return token;
    },
    authorized({ auth }) {
      return !!auth?.user;
    },
    async session({ session, user, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
