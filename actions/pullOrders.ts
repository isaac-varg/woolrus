import prisma from "@/lib/prisma";
import { woo } from "@/lib/woocommerce";
import { GET_PROCESSING_ORDERS } from "@/queries/orders";
import { upsertProduct } from "./upsertProduct";

export async function pullProcessingOrders() {
  const syncStart = new Date();
  let recordsProcessed = 0;
  let cursor: string | null = null;

  try {
    do {
      const data: any = await woo.request(GET_PROCESSING_ORDERS, {
        after: cursor,
      });

      const orders = data.orders.nodes;

      for (const wooOrder of orders) {

        const existing = await prisma.order.findUnique({
          where: { wooId: wooOrder.databaseId },
        });
        if (existing) continue;

        // using a transaction so if anything goes wrong it reverrts
        await prisma.$transaction(async (tx) => {
          // upsert products and variations from line items
          for (const item of wooOrder.lineItems.nodes) {
            await upsertProduct(tx, item);
          }

          // create the order
          const order = await tx.order.create({
            data: {
              wooId: wooOrder.databaseId,
              orderNumber: wooOrder.orderNumber,
              wooStatus: wooOrder.status,
              customerName: `${wooOrder.billing.firstName} ${wooOrder.billing.lastName}`,
              customerEmail: wooOrder.billing.email,
              shippingAddress: wooOrder.shipping,
              billingAddress: wooOrder.billing,
              orderNotes: wooOrder.customerNote,
              paymentMethod: wooOrder.paymentMethod,
              orderTotal: parseFloat(wooOrder.total.replace(/[^0-9.-]/g, '')),
              wooCreatedAt: new Date(wooOrder.date),
            },
          });

          // create order items
          for (const item of wooOrder.lineItems.nodes) {
            const product = await tx.product.findUnique({
              where: { wooId: item.product.node.databaseId },
            });
            const variation = item.variation
              ? await tx.productVariation.findUnique({
                where: { wooId: item.variation.node.databaseId },
              })
              : null;

            await tx.orderItem.create({
              data: {
                orderId: order.id,
                productId: product?.id,
                variationId: variation?.id,
                wooProductId: item.product.node.databaseId,
                wooVariationId: item.variation?.node.databaseId,
                name: item.variation?.node.name || item.product.node.name,
                sku: item.variation?.node.sku || item.product.node.sku,
                quantity: item.quantity,
                price: parseFloat(item.total.replace(/[^0-9.-]/g, '')),
                imageUrl: item.variation?.node.image?.sourceUrl
                  || item.product.node.image?.sourceUrl,
                attributes: item.variation?.node.attributes?.nodes,
              },
            });
          }

          // create workflow for warehouse
          await tx.orderWorkflow.create({
            data: {
              orderId: order.id,
              status: 'PENDING',
            },
          });
        });

        recordsProcessed++;
      }

      cursor = data.orders.pageInfo.hasNextPage
        ? data.orders.pageInfo.endCursor
        : null;
    } while (cursor);

    // log success
    await prisma.syncLog.create({
      data: {
        syncType: 'orders',
        status: 'success',
        recordsProcessed,
        startedAt: syncStart,
        completedAt: new Date(),
      },
    });

    return { success: true, recordsProcessed };
  } catch (error) {
    await prisma.syncLog.create({
      data: {
        syncType: 'orders',
        status: 'error',
        recordsProcessed,
        error: error instanceof Error ? error.message : 'Unknown error',
        startedAt: syncStart,
        completedAt: new Date(),
      },
    });
    throw error;
  }
}
