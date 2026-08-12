export type ResourceStatus =
  | "online"
  | "configured"
  | "not_configured"
  | "offline"
  | "error";


export interface AdminResourceType {
  id: string;
  name: string;
  category: string;

  configured: boolean;

  status: ResourceStatus;

  description: string;

  details?: {
    model?: string | null;
    voice?: string | null;
  };
}


export interface AdminResourcesResponseType {
  resources: AdminResourceType[];
}