"use client";

import { useState } from "react";
import {
  AuthGuard,
  DashboardHeader,
  UploadForm,
  EtalaseTable,
} from "@/components/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, List } from "lucide-react";

export default function AdminDashboardPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger table refresh
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-50 max-w-md mx-auto">
        <DashboardHeader />

        <div className="p-4">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger
                value="upload"
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <Upload className="w-4 h-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <List className="w-4 h-4" />
                List
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-0">
              <UploadForm onSuccess={handleUploadSuccess} />
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <EtalaseTable refreshTrigger={refreshTrigger} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </AuthGuard>
  );
}
