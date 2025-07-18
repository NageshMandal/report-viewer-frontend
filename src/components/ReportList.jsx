import { useEffect, useState } from "react";
import API from "@/api/api";
import { useAuth } from "@/context/AuthContext";
import ReportCard from "@/components/ReportCard";
import { X } from "lucide-react";

export default function ReportList() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    reportType: "",
    confidenceScore: "",
    industry: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setReports(res.data);
      } catch (err) {
        console.error("Failed to fetch reports", err);
      }
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesType = filters.reportType
      ? r.reportType === filters.reportType
      : true;
    const matchesIndustry = filters.industry
      ? r.industry === filters.industry
      : true;
    const matchesConfidence = filters.confidenceScore
      ? r.confidenceScore >= parseInt(filters.confidenceScore)
      : true;
    return matchesType && matchesIndustry && matchesConfidence;
  });

  const unique = (key) => [...new Set(reports.map((r) => r[key]))];

  return (
    <div className="relative">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Report Type</label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.reportType}
            onChange={(e) =>
              setFilters({ ...filters, reportType: e.target.value })
            }
          >
            <option value="">All Types</option>
            {unique("reportType").map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Industry</label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.industry}
            onChange={(e) =>
              setFilters({ ...filters, industry: e.target.value })
            }
          >
            <option value="">All Industries</option>
            {unique("industry").map((industry) => (
              <option key={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-gray-600 mb-1">Confidence</label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-48 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.confidenceScore}
            onChange={(e) =>
              setFilters({ ...filters, confidenceScore: e.target.value })
            }
          >
            <option value="">Any Confidence</option>
            <option value="70">70%+</option>
            <option value="80">80%+</option>
            <option value="90">90%+</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReports.length === 0 ? (
          <p className="text-gray-500">No reports match your filters.</p>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="relative flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full"
              onClick={() => setSelectedReport(report)}
            >
              {/* Image */}
              <div className="relative h-56 m-2.5 overflow-hidden text-white rounded-md">
                <img
                  src="/cardbg.png"
                  alt="report-image"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h6 className="mb-2 text-slate-800 text-xl font-semibold">
                  {report.title}
                </h6>
                <p className="text-slate-600 text-sm mb-1 font-light">
                  Type: {report.reportType}
                </p>
                <p className="text-slate-600 text-sm font-light">
                  Industry: {report.industry}
                </p>
              </div>

              {/* Button */}
              <div className="px-4 pb-4 pt-0 mt-2">
                <button
                  type="button"
                  className="rounded-md bg-slate-800 py-2 px-4 text-sm text-white transition-all shadow-md hover:shadow-lg hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700"
                >
                  Read more
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slide-Out Panel with Full ReportCard */}
      {selectedReport && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[rgba(0,0,0,0.2)] z-40"
            onClick={() => setSelectedReport(null)}
          />

          {/* Slide Panel */}
          <div
            className="fixed top-0 right-0 h-full w-full sm:w-[550px] bg-white z-50 shadow-lg overflow-y-auto transition-all duration-300"
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            <div className="p-5 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-black-700">
                Report Detail
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <ReportCard report={selectedReport} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
