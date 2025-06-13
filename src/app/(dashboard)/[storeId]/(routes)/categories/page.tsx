import prisma from "@/lib/prismadb";
import { CategoriesCilent } from "./components/client";
import { CategoriesColumn } from "./components/columns";
import { format } from "date-fns";

const CategoriesPage = async ({
  params,
}: {
  params: { storeId: string };
}) => {
  const storeId = await params.storeId
  const categories = await prisma.category.findMany({
    where: {
      id: storeId,
    },
    include: {
      billboard: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    biillboardLabel: item.billboard.label,
    CreatedAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesCilent Categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
