import { useEffect, useState } from "react";
import TraceabilityCard from "./TraceabilityCard";
import { useAuth } from "@/context/AuthContext";
import API from "@/api/api";
import { X } from "lucide-react";

export default function ReportCard({ report }) {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackInputs, setFeedbackInputs] = useState([
    { section: "", comment: "" },
  ]);

  const sections = [
    "summary",
    "title",
    "confidenceScore",
    "sources",
    "overall",
  ];

  const availableSections = sections.filter(
    (s) => !feedbackInputs.map((f) => f.section).includes(s)
  );

  const handleInputChange = (index, field, value) => {
    const updated = [...feedbackInputs];
    updated[index][field] = value;
    setFeedbackInputs(updated);
  };

  const addSection = () => {
    setFeedbackInputs([...feedbackInputs, { section: "", comment: "" }]);
  };

  const removeSection = (index) => {
    const updated = feedbackInputs.filter((_, i) => i !== index);
    setFeedbackInputs(updated);
  };

  const handleFeedback = async () => {
    const validFeedbacks = feedbackInputs.filter(
      (f) => f.section && f.comment.trim()
    );

    if (validFeedbacks.length === 0) {
      alert("Please add at least one section with feedback.");
      return;
    }

    const userComment = validFeedbacks
      .map((f) => `${f.section}: ${f.comment.trim()}`)
      .join(" | ");

    const flaggedSection = validFeedbacks.map((f) => f.section).join(",");

    try {
      await API.post(
        "/feedback",
        {
          reportId: report.id,
          userComment,
          flaggedSection,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("✅ Feedback submitted");
      setFeedbackInputs([{ section: "", comment: "" }]);
      if (user.role === "reviewer") fetchFeedbacks();
    } catch (err) {
      alert("❌ Failed to submit feedback");
      console.error(err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get(`/feedback?reportId=${report.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    }
  };

  useEffect(() => {
    if (user?.role === "reviewer") fetchFeedbacks();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
      {/* Report Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
        <p className="text-sm text-gray-600 mt-1">{report.summary}</p>
        <p className="text-sm text-gray-500 mt-2">
          <span className="font-medium text-gray-700">Type:</span>{" "}
          {report.reportType}
        </p>
      </div>

      {/* Confidence Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confidence
        </label>
        <div className="flex items-center space-x-2">
          <div className="w-full h-2 rounded bg-gray-200">
            <div
              className="h-full rounded bg-gradient-to-r from-yellow-400 to-purple-800 transition-all"
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {report.confidenceScore}%
          </span>
        </div>
      </div>

      {/* Trust Section */}
      <details className="group border border-gray-200 rounded-md bg-gray-50 p-4">
        <summary className="flex items-center justify-between cursor-pointer text-sm text-blue-600 font-medium list-none">
          <span>Why We Trust This</span>
          <span className="ml-2 transition-transform duration-200 group-open:rotate-180">
            ▼
          </span>
        </summary>

        <div className="mt-4 space-y-3 text-sm text-gray-700">
          {report.sources.length === 0 ? (
            <p className="text-gray-500">No sources available.</p>
          ) : (
            report.sources.map((src, idx) => (
              <div
                key={idx}
                className="border border-gray-200 rounded-lg bg-white p-3 shadow-sm hover:shadow-md transition"
              >
                <TraceabilityCard source={src} />
              </div>
            ))
          )}
        </div>
      </details>

      {/* Submit Feedback */}
      {user?.role === "viewer" && (
        <div className="border-t border-gray-300 pt-4 space-y-4">
          <h4 className="text-base font-semibold text-gray-800">
            Submit Feedback
          </h4>

          {feedbackInputs.map((input, idx) => (
            <div
              key={idx}
              className="bg-gray-50 border border-gray-300 p-4 rounded-md relative"
            >
              {/* Section Dropdown */}
              <label className="text-sm font-medium text-gray-700">
                Select Section
              </label>
              <select
                className="mt-1 w-full p-2 border border-gray-300 rounded-md text-sm"
                value={input.section}
                onChange={(e) =>
                  handleInputChange(idx, "section", e.target.value)
                }
              >
                <option value="">Select Section</option>
                {sections
                  .filter(
                    (s) =>
                      !feedbackInputs.map((f) => f.section).includes(s) ||
                      s === input.section
                  )
                  .map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
              </select>

              {/* Feedback Textarea */}
              <label className="block mt-4 text-sm font-medium text-gray-700">
                Feedback
              </label>
              <textarea
                rows="3"
                className="mt-1 w-full border border-gray-300 rounded-md p-2 text-sm"
                placeholder={`Write feedback for ${
                  input.section || "this section"
                }...`}
                value={input.comment}
                onChange={(e) =>
                  handleInputChange(idx, "comment", e.target.value)
                }
              />

              {/* Remove Button */}
              {feedbackInputs.length > 1 && (
                <button
                  onClick={() => removeSection(idx)}
                  className="absolute top-3 right-3 text-xs text-red-500"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4 mt-4">
            {availableSections.length > 0 && (
              <button
                onClick={addSection}
                className="border border-[#3F1470] text-[#3F1470] px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#f5f3fa] transition"
              >
                + Add Another Section
              </button>
            )}

            <button
              onClick={handleFeedback}
              className="bg-[#3F1470] text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#33105e] transition"
            >
              Submit All Feedback
            </button>
          </div>
        </div>
      )}

      {/* Reviewer Feedback View */}
      {user?.role === "reviewer" && (
        <details className="border-t pt-4">
          <summary className="text-sm text-blue-600 font-medium cursor-pointer">
            View Submitted Feedback
          </summary>
          <div className="mt-2 ml-4 space-y-3">
            {feedbacks.length === 0 ? (
              <p className="text-sm text-gray-500">
                No feedback submitted yet.
              </p>
            ) : (
              feedbacks.map((fb, idx) => (
                <div key={idx} className="bg-gray-100 p-3 rounded-md">
                  <p className="text-sm text-gray-800">
                    <strong>Comment:</strong> {fb.userComment}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Section:</strong> {fb.flaggedSection}
                  </p>
                  {fb.email && (
                    <p className="text-xs text-gray-400">
                      <strong>By:</strong> {fb.email}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </details>
      )}
    </div>
  );
}
