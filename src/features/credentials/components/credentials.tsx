"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  EntityHeader,
  EntityContainer,
  EntitySearch,
  EntityPagination,
  LoadingView,
  ErrorView,
  EmptyView,
  EntityList,
  EntityItem,
} from "@/components/entity-components";
import { useSuspenseCredentials, useRemoveCredential } from "../hooks/use-credentials";
import useCredentialsParams from "../hooks/use-credentials-params";
import useEntitySearch from "@/hooks/use-entity-search";
import { formatDistanceToNow } from "date-fns";
import { Credential, CredentialType } from "@/generated/prisma";


export function CredentialsSearch() {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
}

export function CredentialsList() {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
}

export function CredentialsHeader({ disabled }: { disabled?: boolean }) {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref="/credentials/new"
      newButtonLabel="New Credential"
      disabled={disabled}
    />
  );
}

export function CredentialsPagination() {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      page={credentials.data.page}
      totalPages={credentials.data.totalPages}
      disabled={credentials.isFetching}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
}

export function CredentialsContainer({ children }: { children: React.ReactNode }) {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
}

export function CredentialsLoading() {
  return <LoadingView message="Loading credentials..." />;
}

export function CredentialsError() {
  return <ErrorView message="Error loading credentials..." />;
}

export function CredentialsEmpty() {
  const router = useRouter();

  function handleCreate() {
    router.push(`/credentials/new`);
  }

  return (
    <EmptyView
      message="You haven't created any credentials yet. Get started by creating your first credential."
      onNew={handleCreate}
    />
  );
}

const credentialsLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export function CredentialItem({ data }: { data: Credential }) {
  const removeCredential = useRemoveCredential();

  const logo = credentialsLogos[data.type] || "/logos/openai.svg";

  function handleRemove() {
    removeCredential.mutate({ id: data.id });
  }

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
}
