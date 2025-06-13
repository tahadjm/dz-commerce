"use client";

import useOrigin from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import ApiAlert from "./api-alert";

interface ApiListPros {
  entityName: string;
  entityIdName: string;
}

const ApiList: React.FC<ApiListPros> = ({ entityName, entityIdName }) => {
  const params = useParams();
  const origin = useOrigin();

  const BaseUrl = `${origin}/api/${params.storeId}`;
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${BaseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${BaseUrl}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${BaseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${BaseUrl}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${BaseUrl}/{${entityIdName}}`}
      />
    </>
  );
};

export default ApiList;
