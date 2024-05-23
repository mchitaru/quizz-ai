"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const UploadDocument = (props: Props) => {
  const [document, setDocument] = useState<Blob | File | null | undefined>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!document) {
      setError("Please upload the document first!");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("pdf", document as Blob);
    try {
      const res = await fetch("/api/quizz/generate", {
        method: "POST",
        body: formData,
      });

      if (res.status === 200) {
        console.log("quizz generated succesfully");
        const data = await res.json();
        console.log(data);
        const quizzId = data.quizzId;

        router.push(`/quizz/${quizzId}`);
      }
    } catch (e: any) {
      console.log("error while generating quizz", e);
    }

    setIsLoading(false);
  };
  return (
    <div className="h-full">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document?.name
                ? document.name
                : "Drag a document here"}
            </div>
            <input
              type="file"
              id="document"
              className="relative block w-full h-full z-50 opacity-0"
              onChange={(e) => setDocument(e?.target?.files?.[0])}
            />
          </label>
          {error ? <p className="text-red-600">{error}</p> : null}
          <Button
            size="lg"
            className="mt-2"
            type="submit"
          >
            Generate Quizz🪄
          </Button>
        </form>
      )}
    </div>
  );
};

export default UploadDocument;
