
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart2, Flame, Calendar, Layers3 } from "lucide-react";
import { ChartContainer } from "./ui/chart";
import ContestHistoryTab from "./StudentDetailModal/ContestHistoryTab";
import ProblemSolvingTab from "./StudentDetailModal/ProblemSolvingTab";

const StudentDetailModal = ({ student, onClose }) => {
  const [tab, setTab] = useState("contest");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-2 py-6">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
        >×</button>
        <div className="mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
          <div className="flex gap-4 flex-wrap mt-2 text-sm text-gray-500">
            <span><strong>Email:</strong> {student.email}</span>
            <span><strong>Phone:</strong> {student.phone}</span>
            <span><strong>CF Handle:</strong> <span className="text-blue-600 font-semibold">{student.codeforcesHandle}</span></span>
          </div>
        </div>
        <Tabs value={tab} onValueChange={setTab} className="mt-6 w-full">
          <TabsList>
            <TabsTrigger value="contest" className="flex items-center gap-2"><BarChart2 size={16}/>Contest History</TabsTrigger>
            <TabsTrigger value="problems" className="flex items-center gap-2"><Flame size={16}/>Problem Solving Data</TabsTrigger>
          </TabsList>
          <TabsContent value="contest">
            <ContestHistoryTab student={student} />
          </TabsContent>
          <TabsContent value="problems">
            <ProblemSolvingTab student={student} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default StudentDetailModal;
