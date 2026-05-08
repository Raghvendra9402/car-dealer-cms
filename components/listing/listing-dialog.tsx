"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { FileUpload } from "./file-upload";
import { useAIState } from "@/hooks/use-ai-state";

export function ListingDialog() {
  const { setIsLoading, reset } = useAIState.getState();
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          reset();
          setIsLoading(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <PlusIcon className="size-4" />
          Create new listing
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl max-h-125 overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create a new car listing</DialogTitle>
        </DialogHeader>
        <FileUpload />
      </DialogContent>
    </Dialog>
  );
}
