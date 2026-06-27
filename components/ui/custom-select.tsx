"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
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

export function CustomSelect({
  value: controlledValue,
  onValueChange,
  defaultValue,
  options = [],
  placeholder = "Pilih opsi...",
  disabled = false,
  searchable = false,
  className,
}: CustomSelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || "");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const isMobile = useIsMobile();

  const handleValueChange = (val: string) => {
    if (!isControlled) {
      setUncontrolledValue(val);
    }
    onValueChange?.(val);
    setOpen(false);
    setSearch("");
  };

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, searchable]);

  const selectedOption = React.useMemo(() => {
    return options.find((opt) => opt.value === value);
  }, [options, value]);

  const triggerClasses = cn(
    "flex items-center justify-between w-full h-[54px] px-5 bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm text-sm text-zinc-900 dark:text-zinc-50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#ccff00]/60 disabled:opacity-40 disabled:cursor-not-allowed select-none text-left",
    className
  );

  // Reset search when dialog/popover closes
  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  if (isMobile) {
    return (
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Trigger asChild disabled={disabled}>
          <button className={triggerClasses}>
            <span className={cn(!selectedOption && "text-zinc-400 dark:text-zinc-500")}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown className="w-4.5 h-4.5 text-zinc-400 shrink-0" />
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
                  className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[2.5rem] p-6 pb-8 border-t border-black/5 dark:border-white/5 shadow-2xl z-50 flex flex-col max-h-[85vh] focus:outline-none"
                >
                  {/* Drag Indicator */}
                  <div className="w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full mx-auto mb-6 shrink-0" />

                  {/* Header Title */}
                  <DialogPrimitive.Title className="font-heading text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-4 shrink-0">
                    {placeholder}
                  </DialogPrimitive.Title>

                  {/* Search Input for Mobile if Searchable */}
                  {searchable && (
                    <div className="flex items-center border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 mb-4 shrink-0 focus-within:ring-2 focus-within:ring-[#ccff00]/60">
                      <input
                        placeholder="Cari..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500"
                      />
                    </div>
                  )}

                  {/* Options List */}
                  <div className="custom-scrollbar overflow-y-auto max-h-[50vh] space-y-1 p-1">
                    {filteredOptions.length === 0 ? (
                      <div className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-8">
                        Data tidak ditemukan.
                      </div>
                    ) : (
                      filteredOptions.map((opt) => {
                        const isSelected = value === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => handleValueChange(opt.value)}
                            className={cn(
                              "flex items-center justify-between w-full px-5 py-4 text-base text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer select-none transition-colors",
                              "active:bg-[#ccff00]/10 active:text-zinc-950 dark:active:text-[#ccff00]",
                              isSelected && "bg-[#ccff00]/10 text-[#506600] dark:text-[#ccff00] font-bold"
                            )}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <Check className="w-5 h-5 text-[#506600] dark:text-[#ccff00]" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    );
  }

  // Desktop Popover Select
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button className={triggerClasses}>
          <span className={cn(!selectedOption && "text-zinc-400 dark:text-zinc-500 truncate")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 ml-2" />
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
                className="z-50 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-xl p-2 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-hidden focus:outline-none flex flex-col"
                style={{ originY: 0 }}
              >
                {/* Desktop Search input if Searchable */}
                {searchable && (
                  <div className="flex items-center border-b border-zinc-100 dark:border-zinc-800 px-3 py-2 shrink-0">
                    <input
                      placeholder="Cari..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent text-sm outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500"
                    />
                  </div>
                )}

                {/* Options List */}
                <div className="custom-scrollbar overflow-y-auto max-h-[250px] p-1 space-y-1 flex-1">
                  {filteredOptions.length === 0 ? (
                    <div className="text-xs text-zinc-400 dark:text-zinc-500 text-center py-4">
                      Data tidak ditemukan.
                    </div>
                  ) : (
                    filteredOptions.map((opt) => {
                      const isSelected = value === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => handleValueChange(opt.value)}
                          className={cn(
                            "flex items-center justify-between w-full px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 rounded-xl cursor-pointer select-none transition-colors",
                            "hover:bg-[#ccff00]/10 hover:text-zinc-950 dark:hover:text-[#ccff00] focus:bg-[#ccff00]/10 focus:text-zinc-950 dark:focus:text-[#ccff00]",
                            isSelected && "bg-[#ccff00]/10 text-[#506600] dark:text-[#ccff00] font-bold"
                          )}
                        >
                          <span className="truncate pr-4">{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#506600] dark:text-[#ccff00] shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}
