"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { collectionSchema } from "@/app/lib/schema";
import { BarLoader } from "react-spinners";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

/**
 * CollectionForm Component
 * Renders a dialog form to create a new collection.
 * 
 * @param {Object} props - Component props.
 * @param {boolean} props.open - State to control dialog visibility.
 * @param {function} props.setOpen - Function to update dialog visibility.
 * @param {boolean} props.loading - Loading state for the form submission.
 * @param {function} props.onSuccess - Callback function on successful submission.
 */
const CollectionForm = ({ onSuccess, loading, open, setOpen }) => {
  // Initialize form with Zod schema for validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    onSuccess(data);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <p className="text-sm text-amber-600/80 flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Average Mood
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              Number of Entries
            </span>
          </p>
        </DialogHeader>

        {/* Loading indicator */}
        {loading && (
          <BarLoader className="mb-4" width={"100%"} color="#f59e0b" />
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-900">Collection Name</label>
            <Input
              {...register("name")}
              placeholder="Enter collection name..."
              className={`bg-white/80 border-amber-200/60 text-amber-900 placeholder:text-amber-500/50 focus:border-amber-400 focus:ring-amber-400/30 ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-amber-900">
              Description (Optional)
            </label>
            <Textarea
              {...register("description")}
              placeholder="Describe your collection..."
              className={`bg-white/80 border-amber-200/60 text-amber-900 placeholder:text-amber-500/50 focus:border-amber-400 focus:ring-amber-400/30 min-h-[100px] resize-none ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-amber-200/40">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-amber-700 hover:text-amber-900"
            >
              Cancel
            </Button>
            <Button type="submit" variant="journal" disabled={loading}>
              {loading ? "Creating..." : "Create Collection"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionForm;