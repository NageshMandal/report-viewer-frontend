import ReportList from "@/components/ReportList";
import Navbar from "@/components/Navbar";

export default function Reports() {
  return (
    <>
    <Navbar />
      {/* Full-width, left-aligned content */}
      <div className="pt-8">
        <h2 className="text-4xl font-bold mb-6">Reports</h2>
        <ReportList />
      </div>
    </>
  );
}
