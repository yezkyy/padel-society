"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  isBefore,
  startOfDay,
  parseISO,
  isValid,
} from "date-fns";
import { id } from "date-fns/locale";

interface CustomDatePickerProps {
  value?: string | Date;
  onChange?: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  bookedDates?: string[]; // array of 'yyyy-MM-dd'
  availableDates?: string[]; // array of 'yyyy-MM-dd'
  holidays?: string[]; // array of 'yyyy-MM-dd'
  className?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Pilih tanggal...",
  disabled = false,
  minDate,
  maxDate,
  bookedDates = [],
  availableDates = [],
  holidays = [],
  className,
}: CustomDatePickerProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [direction, setDirection] = React.useState(0);

  const selectedDate = React.useMemo(() => {
    if (!value) return null;
    if (value instanceof Date) return value;
    const parsed = parseISO(value);
    return isValid(parsed) ? parsed : null;
  }, [value]);

  React.useEffect(() => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  const handleNextMonth = () => {
    setDirection(1);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handlePrevMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setDirection(today > currentMonth ? 1 : -1);
    setCurrentMonth(today);
  };

  const handleSelectDate = (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    onChange?.(formatted);
    setOpen(false);
  };

  // Grid builder
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const getIndonesianDayIndex = (date: Date) => {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1; // Monday = 0, Sunday = 6
  };

  const firstDayIndex = getIndonesianDayIndex(start);
  const paddingDays = Array.from({ length: firstDayIndex });

  const formattedValue = React.useMemo(() => {
    if (!selectedDate) return placeholder;
    return format(selectedDate, "dd MMMM yyyy", { locale: id });
  }, [selectedDate, placeholder]);

  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());
    if (minDate && isBefore(startOfDay(date), startOfDay(minDate))) return true;
    if (maxDate && isBefore(startOfDay(maxDate), startOfDay(date))) return true;
    return false;
  };

  const triggerClasses = cn(
    "flex items-center justify-between w-full h-[54px] px-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#ccff00]/60 disabled:opacity-40 disabled:cursor-not-allowed select-none text-left",
    className
  );

  const renderCalendarContent = () => (
    <div className="w-full max-w-[340px] bg-white dark:bg-zinc-900 flex flex-col space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50 font-heading">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleToday}
            className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            Hari Ini
          </button>
          <button
            onClick={handlePrevMonth}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        <div>Sn</div>
        <div>Sl</div>
        <div>Rb</div>
        <div>Km</div>
        <div>Jm</div>
        <div>Sb</div>
        <div>Mg</div>
      </div>

      {/* Days Grid with Animation */}
      <div className="relative overflow-hidden min-h-[220px]">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentMonth.toString()}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                x: dir > 0 ? 30 : -30,
                opacity: 0,
              }),
              center: {
                x: 0,
                opacity: 1,
              },
              exit: (dir: number) => ({
                x: dir > 0 ? -30 : 30,
                opacity: 0,
              }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="grid grid-cols-7 gap-1 text-center"
          >
            {paddingDays.map((_, idx) => (
              <div key={`pad-${idx}`} className="aspect-square" />
            ))}

            {days.map((day) => {
              const formattedDateStr = format(day, "yyyy-MM-dd");
              const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
              const isCurrentToday = isToday(day);
              const isDisabled = isDateDisabled(day);
              const isBooked = bookedDates.includes(formattedDateStr);
              const isAvailable = availableDates.includes(formattedDateStr);
              const isHoliday = holidays.includes(formattedDateStr);

              return (
                <button
                  key={day.toString()}
                  disabled={isDisabled}
                  onClick={() => handleSelectDate(day)}
                  className={cn(
                    "aspect-square rounded-xl text-xs font-semibold flex flex-col items-center justify-center relative transition-all duration-200",
                    "hover:bg-[#ccff00]/10 hover:text-zinc-950 dark:hover:text-[#ccff00] cursor-pointer",
                    isCurrentToday && "bg-[#ccff00]/10 border border-[#ccff00] text-zinc-900 dark:text-[#ccff00] font-black",
                    isHoliday && "bg-zinc-100/50 dark:bg-zinc-800/40 text-zinc-400 dark:text-zinc-500",
                    isSelected && "bg-[#ccff00] text-black hover:bg-[#ccff00] font-bold shadow-md shadow-[#ccff00]/25 dark:text-black",
                    isDisabled && "opacity-30 cursor-not-allowed hover:bg-transparent hover:text-zinc-400"
                  )}
                >
                  <span>{format(day, "d")}</span>

                  {/* Indicators */}
                  <div className="absolute bottom-1 flex gap-0.5 justify-center w-full">
                    {isBooked && (
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                    )}
                    {isAvailable && (
                      <span className="w-1 h-1 rounded-full bg-[#ccff00]" />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild disabled={disabled}>
          <button className={triggerClasses}>
            <span className={cn(!selectedDate && "text-zinc-400 dark:text-zinc-500")}>
              {formattedValue}
            </span>
            <CalendarIcon className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
          </button>
        </DialogPrimitive.Trigger>

        <AnimatePresence>
          {open && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild>
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 26, stiffness: 260 }}
                  className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[2.5rem] p-6 pb-8 border-t border-black/5 dark:border-white/5 shadow-2xl z-50 flex flex-col max-h-[85vh] focus:outline-none items-center"
                >
                  <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />
                  <DialogPrimitive.Title className="sr-only">Pilih Tanggal</DialogPrimitive.Title>
                  <div className="w-full flex justify-center">
                    {renderCalendarContent()}
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button className={triggerClasses}>
          <span className={cn(!selectedDate && "text-zinc-400 dark:text-zinc-500 truncate")}>
            {formattedValue}
          </span>
          <CalendarIcon className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
        </button>
      </PopoverPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content asChild sideOffset={6} align="start">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 6 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="z-50 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl p-5 w-[340px] focus:outline-none flex flex-col"
                style={{ originY: 0 }}
              >
                {renderCalendarContent()}
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}
