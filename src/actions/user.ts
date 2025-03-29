"use server";

import { client } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { auth } from "@/auth";

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const mailOptions = {
    to,
    subject,
    text,
    html,
  };
  return { transporter, mailOptions };
};

// WIP: Authenticated user to have the password field

export const onAuthenticateUser = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return { status: 403 };
    }

    const userExist = await client.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        workspace: {
          where: {
            User:{
              id: user.id,
            },
          },
        },
        subscription: true
      },
    });
    if (userExist) {
      return { status: 200, user: userExist };
    }
    return { status: 400 };
  } catch (error) {
    console.log("🔴 ERROR", error);
    return { status: 500 };
  }
};

export const getNotifications = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };
    const notifications = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400, data: [] };
  }
};

export const searchUsers = async (query: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };

    const users = await client.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
        NOT: [{ id: user.id }],
      },
      select: {
        id: true,
        subscription: {
          select: {
            plan: true,
          },
        },
        name: true,
        image: true,
        email: true,
      },
    });
    if (users && users.length > 0) {
      return { status: 200, data: users };
    }

    return { status: 404, data: undefined };
  } catch (error) {
    return { status: 500, data: undefined };
  }
};

export const getPaymentInfo = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };

    const payment = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        subscription: {
          select: { plan: true },
        },
      },
    });
    if (payment) {
      return { status: 200, data: payment };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const enableFirstView = async (state: boolean) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };

    const view = await client.user.update({
      where: {
        id: user.id,
      },
      data: {
        firstView: state,
      },
    });

    if (view) {
      return { status: 200, data: "Setting updated" };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const getFirstView = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };
    const userData = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        firstView: true,
      },
    });
    if (userData) {
      return { status: 200, data: userData.firstView };
    }
    return { status: 400, data: false };
  } catch (error) {
    return { status: 400 };
  }
};

export const createCommentAndReply = async (
  userId: string,
  comment: string,
  videoId: string,
  commentId?: string | undefined
) => {
  try {
    if (commentId) {
      const reply = await client.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reply: {
            create: {
              comment,
              userId,
              videoId,
            },
          },
        },
      });
      if (reply) {
        return { status: 200, data: "Reply posted" };
      }
    }

    const newComment = await client.video.update({
      where: {
        id: videoId,
      },
      data: {
        Comment: {
          create: {
            comment,
            userId,
          },
        },
      },
    });
    if (newComment) return { status: 200, data: "New comment added" };
  } catch (error) {
    return { status: 400 };
  }
};

export const getUserProfile = async () => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };
    const profileIdAndImage = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        image: true,
        id: true,
      },
    });

    if (profileIdAndImage) return { status: 200, data: profileIdAndImage };
  } catch (error) {
    return { status: 400 };
  }
};

export const getVideoComments = async (Id: string) => {
  try {
    const comments = await client.comment.findMany({
      where: {
        OR: [{ videoId: Id }, { commentId: Id }],
        commentId: null,
      },
      include: {
        reply: {
          include: {
            User: true,
          },
        },
        User: true,
      },
    });

    return { status: 200, data: comments };
  } catch (error) {
    return { status: 400 };
  }
};

export const inviteMembers = async (
  workspaceId: string,
  recieverId: string,
  email: string
) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };
    const senderInfo = await client.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (senderInfo?.id) {
      const workspace = await client.workSpace.findUnique({
        where: {
          id: workspaceId,
        },
        select: {
          name: true,
        },
      });
      if (workspace) {
        const invitation = await client.invite.create({
          data: {
            senderId: senderInfo.id,
            recieverId,
            workSpaceId: workspaceId,
            content: `You are invited to join ${workspace.name} Workspace, click accept to confirm`,
          },
          select: {
            id: true,
          },
        });

        await client.user.update({
          where: {
            id: user.id,
          },
          data: {
            notification: {
              create: {
                content: `${user.name} invited ${senderInfo.name} into ${workspace.name}`,
              },
            },
          },
        });
        if (invitation) {
          const { transporter, mailOptions } = await sendEmail(
            email,
            "You got an invitation",
            "You are invited to join ${workspace.name} Workspace, click accept to confirm",
            `<a href="${process.env.NEXT_PUBLIC_HOST_URL}/invite/${invitation.id}" style="background-color: #000; padding: 5px 10px; border-radius: 10px;">Accept Invite</a>`
          );

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("🔴", error.message);
            } else {
              console.log("✅ Email sent");
            }
          });
          return { status: 200, data: "Invite sent" };
        }
        return { status: 400, data: "invitation failed" };
      }
      return { status: 404, data: "workspace not found" };
    }
    return { status: 404, data: "recipient not found" };
  } catch (error) {
    console.log(error);
    return { status: 400, data: "Oops! something went wrong" };
  }
};

export const acceptInvite = async (inviteId: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user)
      return {
        status: 404,
      };
    const invitation = await client.invite.findUnique({
      where: {
        id: inviteId,
      },
      select: {
        workSpaceId: true,
        reciever: {
          select: {
            id: true,
          },
        },
      },
    });

    if (user.id !== invitation?.reciever?.id) return { status: 401 };
    const acceptInvite = client.invite.update({
      where: {
        id: inviteId,
      },
      data: {
        accepted: true,
      },
    });

    const updateMember = client.user.update({
      where: {
        id: user.id,
      },
      data: {
        members: {
          create: {
            workSpaceId: invitation.workSpaceId,
          },
        },
      },
    });

    const membersTransaction = await client.$transaction([
      acceptInvite,
      updateMember,
    ]);

    if (membersTransaction) {
      return { status: 200 };
    }
    return { status: 400 };
  } catch (error) {
    return { status: 400 };
  }
};


// WIP: complete subscription...

export const completeSubscription = async (session_id: string) => {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return { status: 404 };

    let customer

    // const customer = await client.user.update({
    //   where: {
    //     id: user.id,
    //   },
    //   data: {
    //     subscription: {
    //       update: {
    //         data: {
    //           customerId: session.customer as string,
    //           plan: "PRO",
    //         },
    //       },
    //     },
    //   },
    // });
    if (customer) {
      return { status: 200 };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 400 };
  }
};
