import { playfair } from "../fonts"; 
import { FiClock, FiTarget, FiActivity, FiPieChart } from "react-icons/fi";
import MobileMenuToggle from "./MobileMenuToggle";

// --- MOCK DATA ---
const WEEKLY_DATA = [
  { day: "Mon", hours: 2.5, percentage: 40 },
  { day: "Tue", hours: 4.0, percentage: 75 },
  { day: "Wed", hours: 1.5, percentage: 25 },
  { day: "Thu", hours: 5.5, percentage: 100 },
  { day: "Fri", hours: 3.0, percentage: 55 },
  { day: "Sat", hours: 6.0, percentage: 110 },
  { day: "Sun", hours: 2.0, percentage: 35 },
];

// Upgraded to use premium gradients
const SKILL_MASTERY = [
  { skill: "Python Programming", progress: 85, color: "from-blue-500 to-teal-400" },
  { skill: "Data Visualization", progress: 65, color: "from-purple-500 to-fuchsia-400" },
  { skill: "Machine Learning", progress: 40, color: "from-teal-500 to-emerald-400" },
  { skill: "SQL Databases", progress: 92, color: "from-amber-500 to-orange-400" },
];

// ================= OPTIMIZED SUB-COMPONENTS =================

// 1. Premium Rounded Weekly Bar Chart
const WeeklyBar = ({ day, idx }: { day: typeof WEEKLY_DATA[0], idx: number }) => (
  <div className="relative flex flex-col items-center flex-1 group">
    {/* Tooltip */}
    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#0F172A] dark:bg-white text-white dark:text-[#0F172A] text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl transition-all duration-300 pointer-events-none z-10 whitespace-nowrap transform group-hover:-translate-y-1">
      {day.hours} hrs
    </div>
    
    {/* Bar Container */}
    <div className="w-full max-w-[36px] h-full flex items-end justify-center rounded-full bg-gray-100/50 dark:bg-[#0A1024]/50 group-hover:bg-gray-200/50 dark:group-hover:bg-[#1E293B]/50 transition-colors relative overflow-hidden p-1">
      <div 
        className={`w-full rounded-full bg-gradient-to-t ${day.percentage > 100 ? 'from-teal-500 to-emerald-300' : 'from-blue-600 to-cyan-400'} shadow-[0_0_15px_rgba(0,0,0,0.1)] opacity-0 animate-[fade-in-up_1.2s_ease-out_forwards]`}
        style={{ height: `${Math.min(day.percentage, 100)}%`, animationDelay: `${idx * 0.1}s` }}
      />
    </div>
    <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-4 uppercase tracking-wider">{day.day}</span>
  </div>
);

// 2. Premium Gradient Skill Progress Bar
const SkillProgressBar = ({ item, idx }: { item: typeof SKILL_MASTERY[0], idx: number }) => (
  <div className="group">
    <div className="flex justify-between items-center mb-2.5">
      <span className="text-sm font-bold text-[#0F172A] dark:text-gray-200 group-hover:text-blue-500 transition-colors">{item.skill}</span>
      <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.progress}%</span>
    </div>
    <div className="w-full h-3 bg-gray-100 dark:bg-[#0A1024] rounded-full overflow-hidden shadow-inner">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${item.color} relative overflow-hidden opacity-0 animate-[fade-in-right_1.2s_ease-out_forwards]`}
        style={{ width: `${item.progress}%`, animationDelay: `${0.5 + (idx * 0.1)}s` }}
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-white/20 w-1/2 -skew-x-12 translate-x-[-150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out"></div>
      </div>
    </div>
  </div>
);


// ================= MAIN PAGE COMPONENT =================

export default async function AnalyticsPage() {
  return (
    <>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          0% { opacity: 0; transform: translateX(-20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050A18] text-[#0F172A] dark:text-gray-200 transition-colors duration-300 font-sans flex relative overflow-hidden">
        
        {/* Ambient Premium Background Glows (GPU Optimized) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-600/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3 transform-gpu will-change-transform"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-500/5 dark:bg-teal-500/10 blur-[120px] rounded-full pointer-events-none translate-y-1/3 -translate-x-1/4 transform-gpu will-change-transform"></div>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 z-10">
          
          {/* Top Header */}
          <header className="h-20 px-6 sm:px-10 flex items-center justify-between bg-white/60 dark:bg-[#050A18]/60 backdrop-blur-xl sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-800/50">
            <h1 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#0F172A] dark:text-white bg-gradient-to-r from-[#0F172A] to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent`}>
              Performance Analytics
            </h1>
            <MobileMenuToggle />
          </header>

          {/* Dashboard Content */}
          <div className="p-4 sm:p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
            <div className="space-y-6 sm:space-y-8">
              
              {/* Top Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "Total Time Spent", value: "124h 30m", change: "+12% this week", icon: FiClock, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
                  { label: "Completion Rate", value: "78%", change: "+5% vs last month", icon: FiTarget, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10" },
                  { label: "Current Streak", value: "14 Days", change: "Personal Best!", icon: FiActivity, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
                  { label: "Avg Assessment", value: "91.5%", change: "Top 3% percentile", icon: FiPieChart, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white/80 dark:bg-[#111C3A]/80 backdrop-blur-md p-5 sm:p-6 rounded-[1.5rem] border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(30,86,160,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 0.1}s` }}>
                    {/* Card Subtle Gradient Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} shadow-sm`}><stat.icon className="w-6 h-6" /></div>
                      <span className="text-[10px] font-bold px-3 py-1 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full border border-green-100 dark:border-green-800/30">{stat.change}</span>
                    </div>
                    <h4 className="text-3xl font-bold text-[#0F172A] dark:text-white mb-1 relative z-10">{stat.value}</h4>
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 relative z-10">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Middle Section: Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Custom Bar Chart: Weekly Activity */}
                <div className="lg:col-span-2 bg-white/80 dark:bg-[#111C3A]/80 backdrop-blur-md rounded-[1.5rem] p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '0.4s' }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Study Hours</h3>
                      <p className="text-sm text-gray-500 mt-1">Your learning activity for the past 7 days</p>
                    </div>
                    <select suppressHydrationWarning className="bg-white dark:bg-[#0A1024] border border-gray-200 dark:border-gray-700 text-sm rounded-xl px-4 py-2 outline-none text-[#0F172A] dark:text-white font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm">
                      <option>This Week</option>
                      <option>Last Week</option>
                      <option>This Month</option>
                    </select>
                  </div>

                  <div className="h-64 sm:h-72 flex items-end justify-between gap-2 sm:gap-6 pt-6 pb-2 border-b border-gray-100 dark:border-gray-800">
                    {WEEKLY_DATA.map((day, idx) => (
                      <WeeklyBar key={idx} day={day} idx={idx} />
                    ))}
                  </div>
                </div>

                {/* Progress Bars: Skill Mastery */}
                <div className="bg-white/80 dark:bg-[#111C3A]/80 backdrop-blur-md rounded-[1.5rem] p-6 sm:p-8 border border-white/50 dark:border-gray-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col relative overflow-hidden opacity-0 animate-[fade-in-up_0.5s_ease-out_forwards]" style={{ animationDelay: '0.5s' }}>
                  {/* Decorative corner accent */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-600/20 rounded-full blur-2xl"></div>

                  <div className="mb-8 relative z-10">
                    <h3 className={`${playfair.className} text-2xl font-bold text-[#0F172A] dark:text-white`}>Skill Mastery</h3>
                    <p className="text-sm text-gray-500 mt-1">Based on assessment scores</p>
                  </div>

                  <div className="flex-1 space-y-6 sm:space-y-8 flex flex-col justify-center relative z-10">
                    {SKILL_MASTERY.map((item, idx) => (
                      <SkillProgressBar key={idx} item={item} idx={idx} />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </main>

      </div>
    </>
  );
}