import useSWR from "swr";
import { getMyProfiles } from "./user.service";

export function useProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    "my-profile",
    () => getMyProfiles(),
    { revalidateOnFocus: false }
  );

  return {
    data,
    isLoading,
    error,
    mutate,
  };
}
