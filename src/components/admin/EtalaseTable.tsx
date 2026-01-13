"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { etalaseService } from "@/services";
import { Etalase } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { List, ExternalLink, Pencil } from "lucide-react";
import { EditEtalaseDialog } from "./EditEtalaseDialog";
import Image from "next/image";

const columnHelper = createColumnHelper<Etalase>();

interface EtalaseTableProps {
  refreshTrigger?: number;
}

export function EtalaseTable({ refreshTrigger }: EtalaseTableProps) {
  const [data, setData] = useState<Etalase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEtalase, setEditingEtalase] = useState<Etalase | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const etalases = await etalaseService.getAllEtalases();
      setData(etalases);
    } catch (error) {
      console.error("Failed to fetch etalases:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  // Handle edit click
  const handleEditClick = (etalase: Etalase) => {
    setEditingEtalase(etalase);
    setIsEditDialogOpen(true);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    fetchData();
  };

  // Define columns as per PRD 4.5
  const columns = useMemo(
    () => [
      columnHelper.accessor("thumbnail_url", {
        header: "Thumbnail",
        cell: (info) => (
          <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
            <Image
              src={info.getValue()}
              alt="Thumbnail"
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
        ),
      }),
      columnHelper.accessor("etalase_number", {
        header: "No.",
        cell: (info) => (
          <span className="font-mono text-sm font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
            #{info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("affiliate_url", {
        header: "URL",
        cell: (info) => (
          <a
            href={info.getValue()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline truncate max-w-20"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{info.getValue()}</span>
          </a>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Aksi",
        cell: (info) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(info.row.original)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-green-600"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <List className="w-5 h-5 text-green-600" />
          Daftar Etalase
          {!isLoading && (
            <span className="text-sm font-normal text-gray-500">
              ({data.length} item)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <List className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Belum ada etalase</p>
            <p className="text-sm text-gray-400">Upload etalase pertama Anda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="text-xs font-medium text-gray-500"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination info */}
            {table.getPageCount() > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <span>
                  Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
                  {table.getPageCount()}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <EditEtalaseDialog
        etalase={editingEtalase}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
}
