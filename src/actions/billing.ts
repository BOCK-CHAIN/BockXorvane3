"use server";

import { client } from "@/lib/prisma";

export const savePaymentToDb = async (userId: string, paymentId: string) => {
  try {
    const response = await client.subscription.update({
      where: {
        userId: userId,
      },
      data: {
        transaction: {
          update: {
            paymentId: paymentId,
          },
        },
      },
    });

    console.log(response);

    return { response };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export const saveOrder = async (
  UserId: string,
  orderData: {
    transaction: {
      orderId: string;
      amount: number;
    };
    plan: "NONE" | "MONTHLY" | "YEARLY";
    startDate: Date;
    expiryDate: Date;
  }
) => {
  try {
    const subscription = await client.subscription.findUnique({
      where: {
        userId: UserId,
      },
    });
    if (!subscription) {
      return { error: "Subscription not found." };
    }
    const transaction = await client.transaction.create({
      data: {
        userId: UserId,
        orderId: orderData.transaction.orderId,
        amount: orderData.transaction.amount,
      },
    });
    const response = await client.subscription.update({
      where: {
        userId: UserId,
      },
      data: {
        transactionId: transaction.id,
        plan: orderData.plan,
        currentPeriodStartDate: orderData.startDate,
        currentPeriodEndDate: orderData.expiryDate,
      },
    });

    console.log(response);
    return { response };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export const getSubscription = async (UserId: string) => {
  try {
    const subscription = await client.subscription.findUnique({
      where: {
        userId: UserId,
      },
    });
    return { subscription };
  } catch (error) {
    console.error(error);
    return { error };
  }
};
