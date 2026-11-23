import { useCallback, useEffect, useRef, useState } from "react";
import { adminProductsApi } from "../api";

const DEFAULT_LIMIT = 10;

const emptyMeta = { total: 0, page: 1, limit: DEFAULT_LIMIT, total_pages: 0 };

/**
 * Server-side paginated admin product list (products page + stock page).
 */
export function usePaginatedAdminProducts({ page, setPage, search = "", status = "", category = "" } = {}) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(emptyMeta);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const hasLoadedOnce = useRef(false);

  const filtersRef = useRef({ search: "", status: "", category: "" });

  const load = useCallback(
    async (pageOverride) => {
      const filtersChanged =
        filtersRef.current.search !== (search || "") ||
        filtersRef.current.status !== (status || "") ||
        filtersRef.current.category !== (category || "");
      if (filtersChanged) {
        filtersRef.current = { search: search || "", status: status || "", category: category || "" };
      }
      let reqPage = pageOverride ?? page;
      if (filtersChanged && pageOverride === undefined) {
        reqPage = 1;
        if (page !== 1) setPage(1);
      }

      if (!hasLoadedOnce.current) {
        setInitialLoading(true);
      } else {
        setFetching(true);
      }
      setError("");

      try {
        const params = {
          page: reqPage,
          limit: DEFAULT_LIMIT,
        };
        if (search?.trim()) params.search = search.trim();
        if (status) params.status = status;
        if (category) params.category = category;

        const { data } = await adminProductsApi.list(params);
        setItems(data.items);
        setMeta({
          total: data.total,
          page: data.page,
          limit: data.limit,
          total_pages: data.total_pages,
        });
        if (data.page !== reqPage) {
          setPage(data.page);
        }
        hasLoadedOnce.current = true;
      } catch {
        setError("Failed to load products.");
        if (!hasLoadedOnce.current) {
          setItems([]);
          setMeta(emptyMeta);
        }
      } finally {
        setInitialLoading(false);
        setFetching(false);
      }
    },
    [page, search, status, category, setPage],
  );

  useEffect(() => {
    load();
  }, [load]);

  const reload = useCallback(() => load(), [load]);

  const reloadAfterDelete = useCallback(async () => {
    const nextTotal = Math.max(0, meta.total - 1);
    const nextTotalPages = nextTotal ? Math.ceil(nextTotal / meta.limit) : 0;
    const targetPage = nextTotalPages && page > nextTotalPages ? nextTotalPages : page;
    await load(targetPage);
  }, [load, meta.limit, meta.total, page]);

  return {
    items,
    meta,
    initialLoading,
    fetching,
    loading: initialLoading || fetching,
    error,
    setError,
    load,
    reload,
    reloadAfterDelete,
  };
}