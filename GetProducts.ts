const { prisma } = require("./lib/prismaClient");

type Categories = "Disposable" | "60ml" | "120ml" | "Salt Nic" | "Other" | null;

interface ReadProduct {
  method: "read";
  fullProduct?: boolean;
  excludeOutOfStock?: boolean;
  id?: string;
  name?: string;
  category?: Categories;
  isFeatured?: true;
}

export default async function getProducts(body: ReadProduct) {
  // return NextResponse.json([]);
  const reqBody: ReadProduct = body;
  // READ
  if (reqBody.method === "read") {
    // if don't need to exclude, nor full product
    if (!reqBody.excludeOutOfStock && !reqBody.fullProduct) {
      const productResponse = await prisma.products.findMany({
        where: {
          id: reqBody.id,
          name: reqBody.name,
          category: reqBody.category,
          isFeatured: reqBody.isFeatured,
        },
      });
      return productResponse;
    } else {
      const productResponse = await prisma.products.findMany({
        where: {
          id: reqBody.id,
          name: reqBody.name,
          category: reqBody.category,
          isFeatured: reqBody.isFeatured,
        },
        include: {
          Sizes_Inventory: true,
        },
      });
      if (reqBody.excludeOutOfStock) {
        // loop through and filter out those with empty Sizes
        const filteredResponse = productResponse.filter((product: any) => {
          return (
            product.Sizes_Inventory != undefined &&
            product.Sizes_Inventory.length != 0
          );
        });
        return filteredResponse;
      } else {
        return productResponse;
      }
    }
  }
}

// module.exports = getProducts;
