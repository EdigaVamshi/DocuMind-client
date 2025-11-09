"use client"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import { FileUpload } from "@/components/ui/file-upload";
import { BackgroundLines } from "@/components/ui/background-lines";
import axios from "axios";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const handlePromptSubmit = async () => {
    if (!files || files.length === 0) {
      setResponse("⚠️ Please upload a PDF document first before asking questions.");
      return;
    }

    if (!prompt.trim()) {
      setResponse("⚠️ Please enter a question about the document.");
      return;
    }

    try {
      setIsLoading(true);
      setResponse("");
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('prompt', prompt);
      const res = await axios.post('https://documind-server-pr1v.onrender.com', formData);
      if (res.status === 200) setResponse(res.data.response);
    } catch (error: any) {
      console.log(error);
      setResponse(error.response?.data?.detail || "❌ An error occurred. Please make sure you've uploaded a PDF file and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundBeamsWithCollision className="h-full">
      <div className="flex flex-col justify-center px-6 gap-y-7 py-12 relative z-50">
        <BackgroundLines className="flex items-center justify-center w-full flex-col">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
            DocuMind
          </h2>
        </BackgroundLines>
        <div className="flex flex-row mx-auto items-center gap-x-2">
          <h2 className="text-xl font-bold text-black md:text-4xl dark:text-white">Study</h2>
          <ContainerTextFlip words={['smart !', 'not the hard way !']} />
        </div>
        <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
          <FileUpload onChange={handleFileUpload} />
        </div>
        <div className="flex flex-col w-full max-w-4xl gap-y-7 mx-auto">
          <div className="relative flex flex-row items-center justify-end w-full">
            <input
              type="text"
              name="prompt"
              placeholder="Ask anything about the document"
              className="w-full border border-gray-300 rounded-full py-3 pl-8 pr-14 focus:outline-none"
              value={prompt}
              onChange={handlePromptChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handlePromptSubmit();
                }
              }}
            />
            <button className="absolute mx-4" onClick={handlePromptSubmit} disabled={isLoading}>
              <IoSend
                size={22}
                className="text-gray-500 cursor-pointer hover:text-blue-500"
              />
            </button>
          </div>
          {response.length > 0 && !isLoading ? (
            <div className="w-full p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg min-h-24 overflow-y-auto">
              <div className="prose dark:prose-invert w-full">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            </div>
          ) : isLoading && (
            //loading animation here
            <div className="w-full p-6 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-lg min-h-24 overflow-y-auto">
              <div className="animate-pulse">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
            </div>
          )}
        </div>
        <footer className="flex flex-row items-center justify-center text-md text-gray-500 dark:text-gray-400 py-10">
          Developed by
          <p className="text-blue-500 font-semibold text-lg mx-2">Ediga Vamshi</p>
        </footer>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
