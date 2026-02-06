import { useState } from "react";

const Documents = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("document", file);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${apiUrl}/api/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Upload successful! File path: ${data.filePath}`);
        setFile(null);
      } else {
        setMessage(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error uploading file.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-10">
        Upload Official Documents
      </h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleUpload} className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Select Document
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-md transition-all ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Documents;
