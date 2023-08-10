import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth'
import GithubProvider from "next-auth/providers/github";
import { connectDB } from '../../../../util/database';
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: '250547107253-fv03f4g3rmib6o1dh4icqe2j2m77m9ln.apps.googleusercontent.com',
      clientSecret: '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',
    }),
    GithubProvider({
      clientId: '7b53c7bad3757b8e31b6',
      clientSecret: '56e1c1de74a4f18d0309dc32f4c165a41a907daf',
    }),
  ],
  secret: '4967t7lee',
  adapter : MongoDBAdapter(connectDB)
};
export default NextAuth(authOptions); 