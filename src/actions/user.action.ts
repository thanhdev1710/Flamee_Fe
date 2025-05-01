"use server";

import { CreateUserType } from "@/types/user.type";

export async function createProfile(profile: CreateUserType) {
  console.log(profile);
}
