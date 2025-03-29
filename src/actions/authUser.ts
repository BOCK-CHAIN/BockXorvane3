"use server";
import { signIn } from "@/auth";
import { client } from "@/lib/prisma";
import bcryptjs from "bcryptjs";

export const checkUser = async (email: string, password: string) => {
  try {
    const existedUser = await client.user.findUnique({
      where: {
        email,
      },
    });
    if (!existedUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }
    
    if (!existedUser.password) {
      return {
        success: false,
        message: "Please provide a password.",
      };
    }
    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.password
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        message: "Password is incorrect.",
      };
    }

    return {
      success: true,
      data: { ...existedUser },
    };
  } catch (error: any) {
    console.log(error)
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getAuthuser = async (userId: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error: any) {
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await client.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error: any) {
    return null;
  }
};

export const addUser = async (
  email: string,
  password: string,
  name: string
) => {
  try {
    const existedUser = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (existedUser) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await client.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        studio: {
          create: {},
        },
        subscription: {
          create: {},
        },
        workspace: {
          create: {
            name: `${name}'s Workspace`,
            type: "PERSONAL",
          },
        },
      },
    });

    return {
      success: true,
      data: newUser,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export async function signInUser(email: string, password: string) {
  try {
    const result = await checkUser(email,password);
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }
    await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    return {
      success: true,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
}
