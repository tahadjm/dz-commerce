import prisma from "@/lib/prismadb";
import CategoriesForm from "../components/CategroyForm";

const CategoriesPage = async ({params}:{params:{categoryId:string}}) => {
    const categoryId = await params.categoryId
    const billboard = await prisma.category.findUnique({
        where:{
            id:categoryId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoriesForm initialData={billboard} />
            </div>
        </div>
    );
}

export default CategoriesPage;