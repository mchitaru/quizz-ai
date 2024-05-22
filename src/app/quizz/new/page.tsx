import React from "react";
import UploadDocument from "../_components/upload-document";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold mb-4">
          What do you want to be quizzed about today?
        </h2>
        <UploadDocument />
      </main>
    </div>
  );
};

export default Page;
