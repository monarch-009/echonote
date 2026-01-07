"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  createJournalEntry,
  updateJournalEntry,
  getJournalEntry,
  getDraft,
  saveDraft,
} from "@/actions/journal";
import { createCollection, getCollections } from "@/actions/collection";
import { getMoodById, MOODS } from "@/app/lib/moods";
import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import { journalSchema } from "@/app/lib/schema";
import "react-quill-new/dist/quill.snow.css";
import CollectionForm from "@/components/collection-form";

// Dynamically import Quill editor to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

/**
 * JournalEntryPage (Write/Edit)
 * Form for creating or editing a journal entry.
 * Handles auto-saving drafts, rich text editing, and collection assignment.
 */
export default function JournalEntryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- Data Fetching Hooks ---
  const {
    loading: collectionsLoading,
    data: collections,
    fn: fetchCollections,
  } = useFetch(getCollections);

  const {
    loading: entryLoading,
    data: existingEntry,
    fn: fetchEntry,
  } = useFetch(getJournalEntry);

  const {
    loading: draftLoading,
    data: draftData,
    fn: fetchDraft,
  } = useFetch(getDraft);

  const { loading: savingDraft, fn: saveDraftFn } = useFetch(saveDraft);

  const {
    loading: actionLoading,
    fn: actionFn,
    data: actionResult,
  } = useFetch(isEditMode ? updateJournalEntry : createJournalEntry);

  const {
    loading: createCollectionLoading,
    fn: createCollectionFn,
    data: createdCollection,
  } = useFetch(createCollection);

  // --- Form Setup ---
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(journalSchema),
    defaultValues: {
      title: "",
      content: "",
      mood: "",
      collectionId: "",
    },
  });

  // --- Effects ---

  // Initial load: determine mode (edit vs create) and fetch data
  useEffect(() => {
    fetchCollections();
    if (editId) {
      setIsEditMode(true);
      fetchEntry(editId);
    } else {
      setIsEditMode(false);
      fetchDraft();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  // Populate form with existing entry or draft
  useEffect(() => {
    if (isEditMode && existingEntry) {
      reset({
        title: existingEntry.title || "",
        content: existingEntry.content || "",
        mood: existingEntry.mood || "",
        collectionId: existingEntry.collectionId || "",
      });
    } else if (draftData?.success && draftData?.data) {
      reset({
        title: draftData.data.title || "",
        content: draftData.data.content || "",
        mood: draftData.data.mood || "",
        collectionId: "",
      });
    } else {
      reset({ title: "", content: "", mood: "", collectionId: "" });
    }
  }, [draftData, isEditMode, existingEntry, reset]);

  // Handle successful collection creation
  useEffect(() => {
    if (createdCollection) {
      setIsCollectionDialogOpen(false);
      fetchCollections();
      setValue("collectionId", createdCollection.id);
      toast.success(`Collection ${createdCollection.name} created!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdCollection]);

  // Handle successful save/publish
  useEffect(() => {
    if (actionResult && !actionLoading) {
      // Clear draft after successful publish if creating new
      if (!isEditMode) {
        saveDraftFn({ title: "", content: "", mood: "" });
      }

      router.push(
        `/collection/${actionResult.collectionId ? actionResult.collectionId : "unorganized"}`
      );

      toast.success(`Entry ${isEditMode ? "updated" : "created"} successfully!`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResult, actionLoading]);

  // --- Handlers ---
  const onSubmit = handleSubmit(async (data) => {
    const mood = getMoodById(data.mood);
    actionFn({
      ...data,
      moodScore: mood.score,
      moodQuery: mood.pixabayQuery,
      ...(isEditMode && { id: editId }),
    });
  });

  const formData = watch();

  const handleSaveDraft = async () => {
    if (!isDirty) {
      toast.error("No changes to save");
      return;
    }
    const result = await saveDraftFn(formData);
    if (result?.success) {
      toast.success("Draft saved successfully");
    }
  };

  const handleCreateCollection = async (data) => {
    createCollectionFn(data);
  };

  const isLoading =
    collectionsLoading ||
    entryLoading ||
    draftLoading ||
    actionLoading ||
    savingDraft;

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={onSubmit} className="space-y-2 mx-auto">
        <h1 className="text-5xl md:text-6xl gradient-title">
          {isEditMode ? "Edit Entry" : "What's on your mind?"}
        </h1>

        {isLoading && (
          <BarLoader className="mb-4" width={"100%"} color="#f59e0b" />
        )}

        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-amber-900">Title</label>
          <Input
            disabled={isLoading}
            {...register("title")}
            placeholder="Give your entry a title..."
            className={`py-5 md:text-md bg-white/80 border-amber-200/50 text-amber-900 placeholder:text-amber-600/50 ${errors.title ? "border-red-500" : ""}`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        {/* Mood Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-amber-900">How are you feeling?</label>
          <Controller
            name="mood"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className={`bg-white/80 border-amber-200/50 text-amber-900 ${errors.mood ? "border-red-500" : ""}`}>
                  <SelectValue placeholder="Select a mood..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(MOODS).map((mood) => (
                    <SelectItem key={mood.id} value={mood.id}>
                      <span className="flex items-center gap-2">
                        {mood.emoji} {mood.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.mood && (
            <p className="text-red-500 text-sm">{errors.mood.message}</p>
          )}
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-amber-900">
            {getMoodById(getValues("mood"))?.prompt ?? "Write your thoughts..."}
          </label>
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden border border-amber-200/50 shadow-sm focus-within:border-amber-300 transition-colors"
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    [{ font: [] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["blockquote", "code-block"],
                    ["link"],
                    ["clean"],
                  ],
                }}
              />
            )}
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
        </div>

        {/* Collection Selector */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-amber-900">
            Add to Collection (Optional)
          </label>
          <Controller
            name="collectionId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  if (value === "new") {
                    setIsCollectionDialogOpen(true);
                  } else {
                    field.onChange(value);
                  }
                }}
                value={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a collection..." />
                </SelectTrigger>
                <SelectContent>
                  {collections?.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">
                    <span className="text-primary">
                      + Create New Collection
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="space-x-4 flex">
          {!isEditMode && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={savingDraft || !isDirty}
            >
              {savingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save as Draft
            </Button>
          )}
          <Button
            type="submit"
            variant="journal"
            disabled={actionLoading || !isDirty}
          >
            {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update" : "Publish"}
          </Button>
          {isEditMode && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                router.push(`/journal/${existingEntry.id}`);
              }}
              variant="destructive"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>

      <CollectionForm
        loading={createCollectionLoading}
        onSuccess={handleCreateCollection}
        open={isCollectionDialogOpen}
        setOpen={setIsCollectionDialogOpen}
      />
    </div>
  );
}