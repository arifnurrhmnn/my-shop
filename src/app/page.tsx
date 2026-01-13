"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux";
import {
  setItems,
  appendItems,
  setLoading,
  setHasMore,
  resetEtalase,
} from "@/redux/slices/etalaseSlice";
import { etalaseService } from "@/services";
import { Header, EtalaseGrid } from "@/components/etalase";

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items, loading, hasMore } = useAppSelector((state) => state.etalase);
  const [searchValue, setSearchValue] = useState("");
  const [offset, setOffset] = useState(0);

  // Initial fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      dispatch(setLoading(true));
      try {
        const result = await etalaseService.fetchEtalases(0, ITEMS_PER_PAGE);
        dispatch(setItems(result.data));
        dispatch(setHasMore(result.hasMore));
        setOffset(ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Failed to fetch etalases:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchInitialData();

    return () => {
      dispatch(resetEtalase());
    };
  }, [dispatch]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(async () => {
    if (loading || !hasMore || searchValue) return;

    dispatch(setLoading(true));
    try {
      const result = await etalaseService.fetchEtalases(offset, ITEMS_PER_PAGE);
      dispatch(appendItems(result.data));
      dispatch(setHasMore(result.hasMore));
      setOffset((prev) => prev + ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Failed to load more etalases:", error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, loading, hasMore, offset, searchValue]);

  // Search handler with debounce effect using useMemo
  const filteredItems = useMemo(() => {
    if (!searchValue.trim()) {
      return items;
    }
    // Filter by etalase_number (real-time filtering)
    return items.filter((item) =>
      item.etalase_number.includes(searchValue.trim())
    );
  }, [items, searchValue]);

  // Handle search - also fetch from server if searching
  useEffect(() => {
    if (!searchValue.trim()) return;

    const searchFromServer = async () => {
      dispatch(setLoading(true));
      try {
        const results = await etalaseService.searchByNumber(searchValue.trim());
        dispatch(setItems(results));
        dispatch(setHasMore(false)); // Disable infinite scroll during search
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    const debounceTimer = setTimeout(searchFromServer, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue, dispatch]);

  // Reset data when search is cleared
  const handleSearchChange = useCallback(
    async (value: string) => {
      setSearchValue(value);

      if (!value.trim()) {
        // Reset to initial state
        dispatch(setLoading(true));
        try {
          const result = await etalaseService.fetchEtalases(0, ITEMS_PER_PAGE);
          dispatch(setItems(result.data));
          dispatch(setHasMore(result.hasMore));
          setOffset(ITEMS_PER_PAGE);
        } catch (error) {
          console.error("Failed to reset etalases:", error);
        } finally {
          dispatch(setLoading(false));
        }
      }
    },
    [dispatch]
  );

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto">
      <Header searchValue={searchValue} onSearchChange={handleSearchChange} />
      <EtalaseGrid
        items={searchValue ? filteredItems : items}
        loading={loading}
        hasMore={searchValue ? false : hasMore}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
}
