/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  ArrowDownLeft, 
  ArrowUpRight, 
  Utensils, 
  Briefcase, 
  Home, 
  Calendar, 
  BarChart3, 
  User,
  Search,
  X,
  Delete,
  ChevronLeft,
  ChevronRight,
  Smile,
  Type,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/src/lib/utils";

// --- Types ---

interface Transaction {
  id: string;
  name: string;
  category: string;
  amount: string;
  icon: any; // Can be Lucide icon or string (emoji)
  isPositive: boolean;
  timestamp: number;
}

// --- Components ---

const Header = () => (
  <header className="flex items-center justify-between px-6 py-4 bg-transparent">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-brand-950 flex items-center justify-center text-white overflow-hidden">
        <User size={20} />
      </div>
      <div>
        <h2 className="text-xs font-medium text-brand-700 uppercase tracking-wider">Welcome back</h2>
        <h1 className="text-lg font-bold text-brand-950 font-display">The Fluid Architect</h1>
      </div>
    </div>
    <button className="p-2 rounded-full bg-white shadow-sm text-brand-800 hover:bg-brand-50 transition-colors">
      <Bell size={20} />
    </button>
  </header>
);

const BalanceCard = ({ balance, previousBalance, onTopUp }: { balance: number, previousBalance: number, onTopUp: () => void }) => {
  const diff = balance - previousBalance;
  const percentChange = previousBalance !== 0 ? (diff / previousBalance) * 100 : 0;
  const isPositive = percentChange >= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 p-8 rounded-[32px] bg-brand-800 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden"
    >
      <div className="relative z-10">
        <p className="text-xs font-medium text-brand-200 uppercase tracking-[0.2em] mb-2">Current Balance</p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-2xl font-light text-brand-300">$</span>
          <h2 className="text-4xl font-bold font-display tracking-tight">
            {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 text-brand-200 text-sm mb-8">
          <div className={cn(
            "flex items-center justify-center w-5 h-5 rounded-full",
            isPositive ? "bg-brand-400/20 text-brand-300" : "bg-red-400/20 text-red-300"
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </div>
          <span>
            {isPositive ? "+" : ""}{percentChange.toFixed(1)}% from last quarter
          </span>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={onTopUp}
            className="flex items-center gap-2 px-6 py-3 bg-brand-950 text-white rounded-full font-semibold text-sm hover:bg-black transition-all active:scale-95 shadow-lg"
          >
            <Plus size={18} />
            <span>Top Up</span>
          </button>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-brand-700 rounded-full blur-3xl opacity-50" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-brand-600 rounded-full blur-3xl opacity-30" />
    </motion.div>
  );
};

const EMOJIS = ["💰", "🍔", "🚗", "🛒", "🎮", "🏠", "🎁", "✈️", "👔", "🏥", "📚", "💡", "🍕", "☕", "🎬", "🏋️", "📱", "💻", "🎸", "🎨", "🌈", "🔥", "✨", "🌟"];

const TopUpModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (amount: number, type: "expense" | "savings", reason: string, icon: any) => void }) => {
  const [step, setStep] = useState<"amount" | "details" | "emoji">( "amount");
  const [type, setType] = useState<"expense" | "savings">("expense");
  const [amount, setAmount] = useState("0");
  const [reason, setReason] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<any>(Utensils);
  const [customReason, setCustomReason] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const expenseReasons = [
    { label: "Food & Dining", icon: Utensils },
    { label: "Transport", icon: "🚗" },
    { label: "Shopping", icon: "🛒" },
    { label: "Entertainment", icon: "🎮" },
    { label: "Custom", icon: Type, isCustom: true },
  ];

  const savingsReasons = [
    { label: "Salary", icon: Briefcase },
    { label: "Gift", icon: "🎁" },
    { label: "Investment", icon: "📈" },
    { label: "Refund", icon: "🔄" },
    { label: "Custom", icon: Type, isCustom: true },
  ];

  const reasons = type === "expense" ? expenseReasons : savingsReasons;

  useEffect(() => {
    if (!isOpen) {
      setStep("amount");
      setAmount("0");
      setReason("");
      setCustomReason("");
      setIsCustom(false);
      setSelectedIcon(type === "expense" ? Utensils : Briefcase);
    }
  }, [isOpen, type]);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
    } else if (key === ".") {
      if (!amount.includes(".")) {
        setAmount(prev => prev + ".");
      }
    } else {
      setAmount(prev => prev === "0" ? key : prev + key);
    }
  };

  const handleNext = () => {
    if (parseFloat(amount) > 0) {
      setStep("details");
    }
  };

  const handleReasonSelect = (r: any) => {
    if (r.isCustom) {
      setIsCustom(true);
      setReason("");
      setStep("emoji");
    } else {
      setReason(r.label);
      setSelectedIcon(r.icon);
      handleConfirm(r.label, r.icon);
    }
  };

  const handleConfirm = (finalReason: string, finalIcon: any) => {
    const numAmount = parseFloat(amount);
    onConfirm(numAmount, type, finalReason || (type === "expense" ? "Expense" : "Savings"), finalIcon);
    onClose();
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "delete"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-950/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[70] px-6 pt-8 pb-12 shadow-2xl max-w-md mx-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                {step !== "amount" && (
                  <button onClick={() => setStep(step === "emoji" ? "details" : "amount")} className="p-2 rounded-full bg-brand-50 text-brand-800">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <h2 className="text-xl font-bold text-brand-950 font-display">
                  {step === "amount" ? "Top Up" : step === "details" ? "Reason" : "Custom Detail"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-brand-50 text-brand-800">
                <X size={20} />
              </button>
            </div>

            {step === "amount" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {/* Toggle */}
                <div className="flex p-1 bg-brand-50 rounded-2xl mb-8">
                  <button
                    onClick={() => setType("expense")}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                      type === "expense" ? "bg-white text-brand-900 shadow-sm" : "text-brand-400"
                    )}
                  >
                    支出 (Expense)
                  </button>
                  <button
                    onClick={() => setType("savings")}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                      type === "savings" ? "bg-white text-brand-900 shadow-sm" : "text-brand-400"
                    )}
                  >
                    存续 (Savings)
                  </button>
                </div>

                {/* Amount Display */}
                <div className="text-center mb-10">
                  <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Enter Amount</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-3xl font-light text-brand-300">$</span>
                    <span className="text-5xl font-bold font-display text-brand-950 tracking-tight">{amount}</span>
                  </div>
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {keys.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKeyPress(key)}
                      className={cn(
                        "h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all active:scale-90",
                        key === "delete" ? "text-brand-400" : "bg-brand-50/50 text-brand-900 hover:bg-brand-50"
                      )}
                    >
                      {key === "delete" ? <Delete size={24} /> : key}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-4 bg-brand-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-900/20 hover:bg-brand-900 transition-all active:scale-95"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <p className="text-center text-xs font-bold text-brand-400 uppercase tracking-widest mb-6">Select a reason for this {type}</p>
                <div className="grid grid-cols-1 gap-3">
                  {reasons.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => handleReasonSelect(r)}
                      className="flex items-center justify-between p-4 bg-brand-50/50 rounded-2xl hover:bg-brand-50 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-brand-600 shadow-sm">
                          {typeof r.icon === "string" ? <span className="text-xl">{r.icon}</span> : <r.icon size={20} />}
                        </div>
                        <span className="font-bold text-brand-900">{r.label}</span>
                      </div>
                      <ChevronRight size={20} className="text-brand-300 group-hover:text-brand-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "emoji" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2 block">Custom Reason</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="What is this for?"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full p-4 bg-brand-50 rounded-2xl border-2 border-transparent focus:border-brand-300 outline-none font-bold text-brand-950 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-3 block">Pick an Icon</label>
                  <div className="grid grid-cols-6 gap-3 max-h-48 overflow-y-auto p-1">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedIcon(emoji)}
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all active:scale-90",
                          selectedIcon === emoji ? "bg-brand-800 shadow-lg" : "bg-brand-50 hover:bg-brand-100"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleConfirm(customReason, selectedIcon)}
                  disabled={!customReason}
                  className="w-full py-4 bg-brand-800 text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-900/20 hover:bg-brand-900 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100"
                >
                  Confirm Transaction
                </button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const StatCard = ({ title, amount, icon: Icon, colorClass, delay }: { title: string, amount: string, icon: any, colorClass: string, delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="bg-white p-5 rounded-[24px] shadow-sm border border-brand-100/50 flex flex-col gap-3"
  >
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", colorClass)}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-brand-400 uppercase tracking-wider mb-1">{title}</p>
      <p className="text-lg font-bold text-brand-950 font-display">{amount}</p>
    </div>
  </motion.div>
);

interface TransactionItemProps {
  name: string;
  category: string;
  amount: string;
  icon: any;
  isPositive?: boolean;
  delay: number;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ name, category, amount, icon: Icon, isPositive, delay }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-center justify-between p-4 hover:bg-brand-50/50 rounded-2xl transition-colors cursor-pointer group"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-white transition-colors">
        {typeof Icon === "string" ? <span className="text-2xl">{Icon}</span> : <Icon size={20} />}
      </div>
      <div>
        <h4 className="font-bold text-brand-950 text-sm">{name}</h4>
        <p className="text-xs text-brand-500">{category}</p>
      </div>
    </div>
    <div className={cn("font-bold text-sm", isPositive ? "text-brand-600" : "text-red-500")}>
      {amount}
    </div>
  </motion.div>
);

const TransactionsHistoryModal = ({ isOpen, onClose, transactions }: { isOpen: boolean, onClose: () => void, transactions: Transaction[] }) => {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const filteredTransactions = transactions.filter(t => t.timestamp >= thirtyDaysAgo);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-950/40 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[90] shadow-2xl flex flex-col"
          >
            <div className="px-6 py-8 border-b border-brand-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="p-2 rounded-full bg-brand-50 text-brand-800">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-brand-950 font-display">Transaction History</h2>
              </div>
              <div className="px-3 py-1 bg-brand-50 rounded-full">
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">Last 30 Days</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {filteredTransactions.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-200 mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-brand-900 mb-1">No Transactions</h3>
                  <p className="text-sm text-brand-400">You haven't made any transactions in the last 30 days.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredTransactions.map((t, i) => (
                    <TransactionItem 
                      key={t.id}
                      name={t.name} 
                      category={t.category} 
                      amount={t.amount} 
                      icon={t.icon}
                      isPositive={t.isPositive}
                      delay={i * 0.03}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-brand-50/50 border-t border-brand-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-brand-500">Total Transactions</span>
                <span className="font-bold text-brand-950">{filteredTransactions.length}</span>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 bg-brand-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-brand-900 transition-all active:scale-95"
              >
                Close History
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const CalendarPanel = ({ transactions }: { transactions: Transaction[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
  
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  
  const getDailyStats = (day: number) => {
    const dayDate = new Date(year, month, day);
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.timestamp);
      return tDate.getDate() === day && tDate.getMonth() === month && tDate.getFullYear() === year;
    });
    
    let income = 0;
    let expense = 0;
    
    dayTransactions.forEach(t => {
      const val = parseFloat(t.amount.replace(/[+$]/g, "").replace(/-\$/g, "-"));
      if (val > 0) income += val;
      else expense += Math.abs(val);
    });
    
    return { income, expense, net: income - expense };
  };

  const totalMonthlyIncome = transactions
    .filter(t => {
      const d = new Date(t.timestamp);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((acc, t) => {
      const val = parseFloat(t.amount.replace(/[+$]/g, "").replace(/-\$/g, "-"));
      return val > 0 ? acc + val : acc;
    }, 0);

  const totalMonthlyExpense = transactions
    .filter(t => {
      const d = new Date(t.timestamp);
      return d.getMonth() === month && d.getFullYear() === year;
    })
    .reduce((acc, t) => {
      const val = parseFloat(t.amount.replace(/[+$]/g, "").replace(/-\$/g, "-"));
      return val < 0 ? acc + Math.abs(val) : acc;
    }, 0);

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="bg-white min-h-screen text-brand-950 pb-20">
      {/* Header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brand-400">Weilin</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-brand-950">RM {(totalMonthlyIncome - totalMonthlyExpense).toLocaleString()}</span>
              <ChevronDown size={16} className="text-brand-400" />
            </div>
          </div>
          <Search size={24} className="text-brand-400" />
        </div>

        <div className="flex items-center justify-between mb-10">
          <button onClick={prevMonth} className="p-2 hover:bg-brand-50 rounded-full transition-colors text-brand-800">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold font-display text-brand-950">{year}年{month + 1}月</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-brand-50 rounded-full transition-colors text-brand-800">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center mb-8">
          <div>
            <p className="text-brand-400 text-xs mb-1">收入</p>
            <p className="text-cyan-600 font-bold">RM {totalMonthlyIncome.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-brand-400 text-xs mb-1">支出</p>
            <p className="text-red-500 font-bold">-RM {totalMonthlyExpense.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-brand-400 text-xs mb-1">总共</p>
            <p className="font-bold text-brand-950">RM {(totalMonthlyIncome - totalMonthlyExpense).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-t border-brand-100">
        {weekDays.map((day, i) => (
          <div key={day} className={cn(
            "py-3 text-center text-xs font-bold border-b border-brand-100",
            i === 0 ? "text-red-500" : "text-brand-400"
          )}>
            {day}
          </div>
        ))}
        
        {/* Previous Month Days */}
        {Array.from({ length: startingDayOfWeek }).map((_, i) => (
          <div key={`prev-${i}`} className="h-24 border-b border-r border-brand-50 p-1 opacity-30">
            <span className="text-xs text-brand-300">{prevMonthLastDay - startingDayOfWeek + i + 1}</span>
          </div>
        ))}

        {/* Current Month Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const stats = getDailyStats(day);
          const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
          
          return (
            <div key={day} className={cn(
              "h-24 border-b border-r border-brand-50 p-1 relative flex flex-col",
              isToday && "bg-brand-50"
            )}>
              <span className={cn(
                "text-xs mb-1",
                (startingDayOfWeek + i) % 7 === 0 ? "text-red-500" : "text-brand-400"
              )}>{day}</span>
              
              <div className="flex-1 flex flex-col justify-end items-end gap-0.5 pr-1 pb-1">
                {stats.income > 0 && (
                  <span className="text-[9px] text-cyan-600 font-medium leading-none">{Math.round(stats.income)}</span>
                )}
                {stats.expense > 0 && (
                  <span className="text-[9px] text-red-500 font-medium leading-none">-{Math.round(stats.expense)}</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Next Month Days */}
        {Array.from({ length: (7 - (startingDayOfWeek + daysInMonth) % 7) % 7 }).map((_, i) => (
          <div key={`next-${i}`} className="h-24 border-b border-r border-brand-50 p-1 opacity-30">
            <span className="text-xs text-brand-300">{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WellnessBanner = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mx-6 mt-8 p-6 rounded-[28px] bg-brand-100 border border-brand-200 relative overflow-hidden"
  >
    <div className="relative z-10">
      <h3 className="text-xl font-bold text-brand-900 mb-2 font-display leading-tight">Financial Wellness is a Journey.</h3>
      <p className="text-sm text-brand-700 mb-6 max-w-[80%]">You've reached 85% of your savings goal this month.</p>
      <button className="px-6 py-3 bg-brand-900 text-white rounded-full text-xs font-bold hover:bg-brand-950 transition-all shadow-md">
        View Detailed Report
      </button>
    </div>
    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200/50 rounded-full -mr-10 -mt-10 blur-2xl" />
  </motion.div>
);

const BottomNav = ({ activeTab, onTabChange, onAddClick }: { activeTab: string, onTabChange: (id: string) => void, onAddClick: () => void }) => {
  const tabs = [
    { id: "home", icon: Home, label: "记录" },
    { id: "calendar", icon: Calendar, label: "日历" },
    { id: "add", icon: Plus, label: "ADD", isCenter: true },
    { id: "reports", icon: BarChart3, label: "统计" },
    { id: "profile", icon: User, label: "钱包" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-brand-100 px-4 pb-8 pt-3 flex justify-around items-center z-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => tab.isCenter ? onAddClick() : onTabChange(tab.id)}
          className={cn(
            "flex flex-col items-center gap-1 transition-all",
            tab.isCenter ? "bg-brand-800 text-white p-3 rounded-full -mt-10 shadow-lg shadow-brand-900/20" : "text-brand-400",
            activeTab === tab.id && !tab.isCenter && "text-brand-800"
          )}
        >
          <tab.icon size={tab.isCenter ? 24 : 20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
          {!tab.isCenter && (
            <span className={cn("text-[9px] font-bold tracking-widest", activeTab === tab.id ? "opacity-100" : "opacity-0")}>
              {tab.label}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [burn, setBurn] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Simulated previous quarter balance for comparison
  const previousQuarterBalance = 125000;

  const handleConfirm = (amount: number, type: "expense" | "savings", reason: string, icon: any) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      name: reason,
      category: type === "expense" ? "Expense" : "Savings",
      amount: (type === "expense" ? "-" : "+") + "$" + amount.toLocaleString(undefined, { minimumFractionDigits: 2 }),
      icon: icon,
      isPositive: type === "savings",
      timestamp: Date.now()
    };

    setTransactions(prev => [newTransaction, ...prev]);

    if (type === "savings") {
      setBalance(prev => prev + amount);
      setIncome(prev => prev + amount);
    } else {
      setBalance(prev => prev - amount);
      setBurn(prev => prev + amount);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen pb-32 relative overflow-x-hidden bg-white">
      {activeTab === "home" ? (
        <>
          <Header />
          <main className="mt-2 space-y-6">
            <BalanceCard 
              balance={balance} 
              previousBalance={previousQuarterBalance}
              onTopUp={() => setIsTopUpOpen(true)} 
            />
            
            <div className="grid grid-cols-2 gap-4 px-6">
              <StatCard 
                title="Verified Income" 
                amount={`$${income.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={ArrowDownLeft} 
                colorClass="bg-cyan-50 text-cyan-600"
                delay={0.1}
              />
              <StatCard 
                title="Total Burn" 
                amount={`$${burn.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
                icon={ArrowUpRight} 
                colorClass="bg-orange-50 text-orange-600"
                delay={0.2}
              />
            </div>
            
            <section className="px-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-950 font-display">Recent Transactions</h3>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="text-xs font-bold text-brand-400 hover:text-brand-600 transition-colors uppercase tracking-widest"
                >
                  See All
                </button>
              </div>
              
              <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                  {transactions.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-12 text-center"
                    >
                      <p className="text-brand-400 text-sm italic">No transactions yet. Start by topping up!</p>
                    </motion.div>
                  ) : (
                    transactions.slice(0, 5).map((t, i) => (
                      <TransactionItem 
                        key={t.id}
                        name={t.name} 
                        category={t.category} 
                        amount={t.amount} 
                        icon={t.icon}
                        isPositive={t.isPositive}
                        delay={i * 0.05}
                      />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </section>
            
            <WellnessBanner />
          </main>
        </>
      ) : activeTab === "calendar" ? (
        <CalendarPanel transactions={transactions} />
      ) : (
        <div className="flex items-center justify-center h-screen text-brand-400 font-bold uppercase tracking-widest">
          {activeTab} Panel Coming Soon
        </div>
      )}
      
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onAddClick={() => setIsTopUpOpen(true)} 
      />

      <TopUpModal 
        isOpen={isTopUpOpen} 
        onClose={() => setIsTopUpOpen(false)} 
        onConfirm={handleConfirm}
      />

      <TransactionsHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        transactions={transactions}
      />
    </div>
  );
}
