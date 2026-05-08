"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  bodyTypeSelect,
  fuelSelect,
  // makeSelect,
  transmissionSelect,
} from "@/config/filter-select-types";
import { createListingSchema } from "@/config/types";
import { useAIState } from "@/hooks/use-ai-state";
import {
  useCreateCarListing,
  useGetMakes,
  useGetOneListing,
  useUpdateListing,
} from "@/hooks/useCarListings";
import {
  BodyType,
  MakeName,
  ModelFuelType,
  ModelTransMission,
} from "@/lib/generated/prisma/enums";

import { zodResolver } from "@hookform/resolvers/zod";
import { JSONValue } from "ai";
import { Pencil, Save, X, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { FileUpload } from "./file-upload";
import { ListingEditImageUpload } from "./listing-image-edit-upload";

interface ListingEditFormProps {
  listingId: string;
}

export function ListingEditForm({ listingId }: ListingEditFormProps) {
  const [addTag, setAddTag] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const handleUpdate = useUpdateListing();
  const { s3Keys: keys } = useAIState.getState();

  const { data, isLoading } = useGetOneListing(listingId);
  const { data: makes } = useGetMakes();

  const makeSelect = makes?.map((m) => ({
    itemName: m.name,
    itemValue: m.id,
  }));

  const form = useForm<z.infer<typeof createListingSchema>>({
    resolver: zodResolver(createListingSchema),
    defaultValues: {
      modelName: data.carName,
      makeId: data.makeId,
      year: data.carYear,
      tags: data.tags,
      description: data.description || "",
      seats: data.seats,
      bodyType: data.bodyType,
      odometer: data.odometer,
      color: data.color,
      fuel: data.fuelType,
      transmission: data.transmission,
      location: data.location,
      imageKeys: [],
      price: data.price,
    },
  });

  const onSubmit = async (values: z.infer<typeof createListingSchema>) => {
    console.log("submitting...");
    const payload = {
      ...values,
      listingId,
      imageKeys: keys,
    };
    handleUpdate.mutate(payload);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddTag = () => {
    if (addTag.trim()) {
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, addTag.trim()]);
      setAddTag("");
    }
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((_, i) => i !== index),
    );
  };

  const makeMap = useMemo(() => {
    const map: Record<string, string> = {};
    makes?.forEach((m) => {
      map[m.id] = m.name;
    });
    return map;
  }, [makes]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex gap-6 h-full">
      <div className="w-96 shrink-0">
        <div className="sticky top-0 space-y-4">
          {isEditing ? (
            <ListingEditImageUpload listingId={listingId} />
          ) : (
            <div className="w-full h-72 rounded-lg overflow-hidden border bg-muted">
              {data.images && data.images.length > 0 ? (
                <Image
                  src={data.images[selectedImage].signedUrl}
                  alt={`Vehicle image ${selectedImage + 1}`}
                  fill
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No images available
                </div>
              )}
            </div>
          )}

          {data.images && data.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {data.images.map((image, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image.signedUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {data.images && data.images.length > 0 && (
            <p className="text-xs text-muted-foreground text-center mt-5">
              {selectedImage + 1} / {data.images.length} images
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Vehicle Information</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Review and edit vehicle details
            </p>
          </div>
          {!isEditing ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setIsEditing(false)}
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          )}
        </div>

        <form
          id="vehicle-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="makeId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="make">Make</FieldLabel>
                      {isEditing ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select make of car" />
                          </SelectTrigger>
                          <SelectContent>
                            {makeSelect?.map((mke, idx) => (
                              <SelectItem value={mke.itemValue} key={idx}>
                                {mke.itemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {makeMap[field.value] || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="modelName"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Model</FieldLabel>
                      {isEditing ? (
                        <Input id="name" placeholder="e.g., Camry" {...field} />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="year"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="year">Year</FieldLabel>
                      {isEditing ? (
                        <Input
                          id="year"
                          type="number"
                          placeholder="2020"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="color"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="color">Color</FieldLabel>
                      {isEditing ? (
                        <Input
                          id="color"
                          placeholder="e.g., Silver"
                          {...field}
                        />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="odometer"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="odometer">Odometer (km)</FieldLabel>
                      {isEditing ? (
                        <Input
                          id="odometer"
                          type="number"
                          placeholder="50000"
                          step={1000}
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value
                            ? `${field.value.toLocaleString()} km`
                            : "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="location">Location</FieldLabel>
                      {isEditing ? (
                        <Input
                          id="location"
                          placeholder="e.g., Mumbai, Maharashtra"
                          {...field}
                        />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="seats"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="seats">Seats</FieldLabel>
                      {isEditing ? (
                        <Input
                          type="number"
                          step={1}
                          placeholder="no. of seats"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="bodyType"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="bodyType">Body Type</FieldLabel>
                      {isEditing ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select body type" />
                          </SelectTrigger>
                          <SelectContent>
                            {bodyTypeSelect.map((val, idx) => (
                              <SelectItem key={idx} value={val.itemValue}>
                                {val.itemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="fuel"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="fuel">Fuel Type</FieldLabel>
                      {isEditing ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelSelect.map((val, idx) => (
                              <SelectItem key={idx} value={val.itemValue}>
                                {val.itemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  control={form.control}
                  name="transmission"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="transmission">
                        Transmission
                      </FieldLabel>
                      {isEditing ? (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissionSelect.map((val, idx) => (
                              <SelectItem key={idx} value={val.itemValue}>
                                {val.itemName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="text-sm py-2 px-3 border rounded-md bg-muted/50">
                          {field.value || "—"}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Tags</h3>
              <Controller
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <Field>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {field.value.length > 0 ? (
                        field.value.map((tag, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="px-3 py-1.5"
                          >
                            {tag}
                            {isEditing && (
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(idx)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No tags added
                        </p>
                      )}
                    </div>
                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag"
                          value={addTag}
                          onChange={(e) => setAddTag(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            (e.preventDefault(), handleAddTag())
                          }
                        />
                        <Button type="button" onClick={handleAddTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Description & Condition
              </h3>

              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    {isEditing ? (
                      <Textarea
                        id="description"
                        placeholder="Detailed vehicle description..."
                        className="w-full px-3 py-2 border rounded-md min-h-24 text-sm resize-none"
                        {...field}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 border rounded-md bg-muted/50 whitespace-pre-wrap">
                        {field.value || "—"}
                      </p>
                    )}
                  </Field>
                )}
              />

              {/* <Controller
                control={form.control}
                name="looks"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="looks">Overall Condition</FieldLabel>
                    {isEditing ? (
                      <textarea
                        id="looks"
                        placeholder="Describe the vehicle's condition..."
                        className="w-full px-3 py-2 border rounded-md min-h-24 text-sm resize-none"
                        {...field}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 border rounded-md bg-muted/50 whitespace-pre-wrap">
                        {field.value || "—"}
                      </p>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="report"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="report">Damage Report</FieldLabel>
                    {isEditing ? (
                      <textarea
                        id="report"
                        placeholder="Any damages or issues..."
                        className="w-full px-3 py-2 border rounded-md min-h-24 text-sm resize-none"
                        {...field}
                      />
                    ) : (
                      <p className="text-sm py-2 px-3 border rounded-md bg-muted/50 whitespace-pre-wrap">
                        {field.value || "—"}
                      </p>
                    )}
                  </Field>
                )}
              /> */}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Set Price</h3>
              <Controller
                control={form.control}
                name="price"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="space-y-3">
                      {isEditing && (
                        <>
                          <FieldLabel htmlFor="price">Vehicle Price</FieldLabel>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                              ₹
                            </span>
                            <Input
                              id="price"
                              type="number"
                              placeholder="0"
                              className="pl-8 text-lg font-semibold"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </div>
                        </>
                      )}

                      {field.value > 0 && (
                        <div className="relative overflow-hidden rounded-xl border-2 border-primary/20 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
                          <div className="relative">
                            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                              {isEditing ? "Preview" : "Asking Price"}
                            </p>
                            <div className="flex items-baseline gap-2">
                              <span className="text-5xl font-bold text-primary tracking-tight">
                                {formatPrice(field.value)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                              {field.value.toLocaleString("en-IN")} Rupees
                            </p>
                          </div>
                        </div>
                      )}

                      {field.value === 0 && !isEditing && (
                        <div className="relative overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-6">
                          <div className="relative text-center">
                            <p className="text-sm font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                              Asking Price
                            </p>
                            <p className="text-2xl font-bold text-muted-foreground/50">
                              Not Set
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Field>
                )}
              />
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                form="vehicle-form"
              >
                Update Listing
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
