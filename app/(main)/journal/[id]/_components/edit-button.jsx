"use client";

import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * EditButton Component
 * Navigation button to toggle edit mode for a journal entry.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.entryId - ID of the entry to edit.
 */
export default function EditButton({ entryId }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push(`/journal/write?edit=${entryId}`)}
    >
      <Edit className="h-4 w-4 mr-2" />
      Edit
    </Button>
  );
}