import { cn } from "@/lib/utils";
import { auth, signIn } from "@/auth";
import { client } from "@/lib/prisma";
import { SubscriptionCard } from "./subscription-card";

type Props = {
  params: {  workspaceId: string };
};

export default async function BillingPage({ params }: Props) {
  const session = await auth();
  const user = session?.user;
  const { workspaceId } = params

  console.log(workspaceId)

  if (!user) {
    signIn();
    return;
  }

  const workspace = await client.workSpace.findUnique({
    where: {
      id: workspaceId
    },
    select: {
      User:{
        include:{
          subscription: true
        }
      }
    }
  })

  if (!workspace || !workspace.User) {
    return null;
  }
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className={cn("text-3xl font-bold mb-8")}>Subscription</h1>
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Membership</h2>
          <SubscriptionCard userId={workspace.User.id} plan={workspace.User?.subscription?.plan} email={workspace.User?.email} name={workspace.User.name as string}  subscription={workspace.User?.subscription} />
        </section>
      </div>
    </div>
  )
}