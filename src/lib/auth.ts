import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "@/lib/polar";
import prisma from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "e6e50043-f2f4-4579-b27e-ed34012ef41b",
              slug: "pro",
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL!,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ]
    })
  ],
});
