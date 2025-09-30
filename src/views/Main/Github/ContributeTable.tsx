import { ContributionCalendar, fetchGitHubContributions } from "@/utils/github";
import { useState } from "react";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const ContributeTable = () => {
  const [contributions, setContributions] =
    useState<ContributionCalendar | null>(null);
  const userName = "GoGangH";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchGitHubContributions(userName);
      setContributions(data);
    } catch (err) {
      setError("Failed to fetch contributions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold flex items-center gap-2">
        Total Contributions: {contributions?.totalContributions ?? 0}
        <button
          onClick={handleFetch}
          disabled={loading}
          className="disabled:opacity-50"
        >
          <AutorenewIcon fontSize="small" />
        </button>
      </div>
      <div className="max-w-fit flex gap-1 overflow-y-visible py-8">
        {contributions &&
          contributions.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-rows-7 gap-1">
              {week.contributionDays.map((day, dayIndex) => (
                <GitContributeItem
                  key={`${weekIndex}-${dayIndex}`}
                  color={day.color}
                  count={day.contributionCount}
                  date={new Date(day.date)}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContributeTable;

interface GitContributeItemProps {
  key: string;
  date: Date;
  count: number;
  color: string;
}
const GitContributeItem: React.FC<GitContributeItemProps> = ({
  key,
  date,
  count,
  color,
}) => {
  return (
    <div
      key={key}
      className="relative w-3 h-3 rounded-sm flex items-center justify-center group"
      style={{ backgroundColor: color }}
    >
      <div className="hidden px-1 py-0.5 bg-gray-600 text-white group-hover:block absolute -top-7 w-[130px] justify-center rounded-lg z-20 pointer-events-none">{`${date.toLocaleDateString()}(${count})`}</div>
    </div>
  );
};
