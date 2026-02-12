import { PrismaClient } from "@/prisma/generated/client";

type TransactionClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

export const upsertProduct = async (tx: TransactionClient, item: any) => {
  const productNode = item.product.node;

  const product = await tx.product.upsert({
    where: { wooId: productNode.databaseId },
    update: {
      name: productNode.name,
      sku: productNode.sku,
      imageUrl: productNode.image?.sourceUrl,
    },
    create: {
      wooId: productNode.databaseId,
      name: productNode.name,
      sku: productNode.sku,
      imageUrl: productNode.image?.sourceUrl,
      productType: item.variation ? "variable" : "simple",
    },
  });

  if (item.variation) {
    const variationNode = item.variation.node;

    await tx.productVariation.upsert({
      where: { wooId: variationNode.databaseId },
      update: {
        name: variationNode.name,
        sku: variationNode.sku,
        imageUrl: variationNode.image?.sourceUrl,
        attributes: variationNode.attributes?.nodes ?? [],
      },
      create: {
        wooId: variationNode.databaseId,
        productId: product.id,
        name: variationNode.name,
        sku: variationNode.sku,
        imageUrl: variationNode.image?.sourceUrl,
        attributes: variationNode.attributes?.nodes ?? [],
      },
    });
  }
}
