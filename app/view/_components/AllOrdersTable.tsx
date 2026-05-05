'use client'

import DataTable from "@/components/app/DataTable";
import { OrderWithItems } from "@/actions/orders/getOrders";
import { formatDate } from "@/utils/date/formatDate";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { WorkflowStatus } from "@/prisma/generated/enums";

const statusBadge: Record<WorkflowStatus, string> = {
  PENDING: 'badge-warning',
  PICKING: 'badge-info',
  PACKING: 'badge-info',
  QA: 'badge-secondary',
  READY: 'badge-success',
  COMPLETED: 'badge-success',
  ON_HOLD: 'badge-ghost',
  CANCELLED: 'badge-error',
};

const AllOrdersTable = ({ orders }: { orders: OrderWithItems[] }) => {
  const router = useRouter();
  const t = useTranslations('orders.table');
  const tStatus = useTranslations('orderDetail.status');
  const tOrders = useTranslations('orders');

  const columns = useMemo<ColumnDef<OrderWithItems, unknown>[]>(() => [
    {
      accessorKey: 'orderNumber',
      header: t('orderNumber'),
      cell: ({ getValue }) => <span className="font-mono">{String(getValue())}</span>,
    },
    {
      accessorKey: 'customerName',
      header: t('customer'),
    },
    {
      id: 'items',
      header: t('items'),
      accessorFn: (row) => row.items.length,
    },
    {
      accessorKey: 'workflowStatus',
      header: tOrders('status'),
      cell: ({ getValue }) => {
        const status = getValue() as WorkflowStatus;
        return (
          <span className={`badge badge-sm ${statusBadge[status] ?? 'badge-ghost'}`}>
            {tStatus(status)}
          </span>
        );
      },
    },
    {
      accessorKey: 'orderTotal',
      header: tOrders('total'),
      cell: ({ getValue }) => `$${(getValue() as number).toFixed(2)}`,
    },
    {
      accessorKey: 'wooCreatedAt',
      header: t('orderDate'),
      cell: ({ getValue }) => formatDate(getValue() as Date),
      sortingFn: 'datetime',
    },
  ], [t, tOrders, tStatus]);

  return (
    <DataTable
      data={orders}
      columns={columns}
      searchPlaceholder={tOrders('searchPlaceholder')}
      emptyMessage={tOrders('noOrders')}
      onRowClick={(order) => router.push(`/orders/${order.orderNumber}?id=${order.id}`)}
    />
  );
};

export default AllOrdersTable;
