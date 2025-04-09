'use server'
import cron from 'node-cron'
import { client } from './prisma'
export const scheduleSubscriptionCleanup = () => {
  console.log('[CRON] Starting subscription cleanup cron job...')

  cron.schedule('0 0 * * *', async () => {
    const cutoffDate = new Date()

    const deleted = await client.subscription.updateMany({
        where: {
            currentPeriodEndDate: {
                lt: cutoffDate
            }
        },
        data: {
            currentPeriodEndDate: null,
            currentPeriodStartDate: null,
            transactionId: null,
            plan: "NONE"
        }
    })
    console.log(deleted)

    console.log(`[CRON] Deleted ${deleted.count} old subscriptions`)
  })
}
