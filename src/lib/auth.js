import { betterAuth } from "better-auth";
import { admin, jwt } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI);
const db = client.db("skillswap");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [
    admin({
      defaultRole: "client",
      adminRoles: ["admin"],
    }),
    jwt(),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      accountType: {
        type: "string",
        defaultValue: "client",
      }
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (user.accountType && user.accountType !== "admin") {
            user.role = user.accountType;
          }
          return { data: user };
        }
      }
    }
  },
  session: {
    cookieCache: {
      enabled: true,
      options: {
        strategy: "jwt",
        maxAge: 60 *24 * 30,
      }
    }
  }
});
