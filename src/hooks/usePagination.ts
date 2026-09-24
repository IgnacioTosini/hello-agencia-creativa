"use client";

import { useMemo, useState } from "react";

type PaginationState = {
  filterKey: string;
  page: number;
};

type UsePaginationOptions<Item> = {
  items: Item[];
  pageSize: number;
  filterKey: string;
};

export const usePagination = <Item>({
  items,
  pageSize,
  filterKey,
}: UsePaginationOptions<Item>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    filterKey,
    page: 1,
  });

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const requestedPage =
    pagination.filterKey === filterKey ? pagination.page : 1;
  const currentPage = Math.min(requestedPage, totalPages);
  const firstItem = items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, items.length);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;

    return items.slice(start, start + pageSize);
  }, [currentPage, items, pageSize]);

  const setCurrentPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);

    setPagination({
      filterKey,
      page: safePage,
    });
  };

  return {
    currentPage,
    firstItem,
    lastItem,
    paginatedItems,
    setCurrentPage,
    totalPages,
  };
};
