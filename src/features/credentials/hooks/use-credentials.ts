import { useMutation, useQueryClient, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import useCredentialsParams from "./use-credentials-params";
import { CredentialType } from "@/generated/prisma";

/** 
 * Hook to fetch all credentials using suspence
*/
export function useSuspenseCredentials() {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();

  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

/** 
 * Hook to fetch a single credential using suspence
*/
export function useSuspenseCredential(id: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
}

/** 
 * Hook to fetch credentials by type
*/
export function useCredentialsByType(type: CredentialType) {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
}

/**
 * Hook to create a new credential
*/
export function useCreateCredential() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(trpc.credentials.create.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" created`);

      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
    },
    onError: (error) => {
      toast.error(`Failed to create credential: ${error.message}`);
    },
  }));
}

/**
 * Hook to remove a credential
*/
export function useRemoveCredential() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(trpc.credentials.remove.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" removed`);

      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }));
    },
    onError: (error) => {
      toast.error(`Failed to remove credential: ${error.message}`);
    },
  }));
}

/**
 * Hook to update a credential
*/
export function useUpdateCredential() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(trpc.credentials.update.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Credential "${data.name}" saved`);

      queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
      queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }));
    },
    onError: (error) => {
      toast.error(`Failed to save credential: ${error.message}`);
    },
  }));
}
