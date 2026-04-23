"use client";
import React, { useState } from "react";

function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });

const [file, setFile] = useState<File | null>(null);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    comment: "",
    file: "",
  });

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setFile(null); 
      setErrors((prev) => ({
        ...prev,
        file: "File size should be less than 2MB",
      }));
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({
      ...prev,
      file: "",
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file && file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File size should be less than 2MB",
      }));
      return;
    }

    console.log({
      ...formData,
      file: file ? file.name : null,
    });

    alert("Form submitted successfully!");

    setFormData({
      name: "",
      email: "",
      comment: "",
    });
    setFile(null);
    setErrors({
      name: "",
      email: "",
      comment: "",
      file: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-200 shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Query Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <textarea
              name="comment"
              placeholder="Write your message..."
              value={formData.comment}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg p-2"
            />
            {errors.comment && (
              <p className="text-red-500 text-sm">{errors.comment}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded-lg p-2"
            />

            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file}</p>
            )}

            {file && !errors.file && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {file.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;