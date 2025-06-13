import prisma from "@/lib/prismadb";
import ProductForm from "../components/ProductForm";


const ProductPage = async ({ params }: { params: { productId: string } }) => {
  const productId = await params.productId;
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },include:{
        Images:true
    }
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm  initialData={product} />
      </div>
    </div>
  );
};

export default ProductPage;
