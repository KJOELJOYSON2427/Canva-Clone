import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
export const {signIn,signOut,auth,handlers}=NextAuth({
    providers:[Google],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 60 * 60 * 24, // 1 hour in seconds
      },
      jwt: {
        maxAge: 60 * 60 * 60 * 60 * 24, // 1 hour in seconds
      },
    callbacks :{
        async jwt({
            token, account
        }){
            if(account?.id_token){
                token.idToken = account.id_token;
            }


            return token
        },
        async session({session, token}){
            session.idToken = token.idToken
            return session
        }

    },
    
})