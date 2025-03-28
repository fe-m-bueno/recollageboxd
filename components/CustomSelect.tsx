"use client";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import React from "react";

interface Option<T> {
  value: T;
  label: string;
}

interface CustomSelectProps<T> {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
  labelKey?: string;
  menuPlacement?: "top" | "bottom";
}

const CustomSelect = <T extends string | number>({
  value,
  onChange,
  options,
  labelKey,
  menuPlacement = "bottom",
}: CustomSelectProps<T>) => {
  return (
    <div className="relative w-full ~text-base/md text-nowrap">
      {labelKey && <label className="block mb-2 pl-3">{labelKey}</label>}
      <Listbox value={value} onChange={onChange}>
        <ListboxButton className="w-full flex justify-between items-center  bg-[#8899aa] border-t border-[#b2bdc8] px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-white/50 ~text-xs/base text-black">
          {options.find((o) => o.value === value)?.label}
          <ChevronDown className="pl-1 ~h-3/6 ~w-2/6 text-[#323540]" />
        </ListboxButton>

        <ListboxOptions
          anchor={menuPlacement === "top" ? "top" : "bottom"}
          transition
          className={`[--anchor-gap:2px] sm:[--anchor-gap:4px] ${
            menuPlacement === "top"
              ? "origin-bottom-center"
              : "origin-top-center"
          } transition duration-200 ease-out [--anchor-] absolute bg-[#8899aa] w-[var(--button-width)] text-black dark:border-white/10 border-black/10 rounded shadow-lg z-10 data-[closed]:scale-95 data-[closed]:opacity-0`}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              className="cursor-pointer select-none px-4 py-2 data-[focus]:bg-[#00ac1c] data-[focus]:text-white"
            >
              {({ selected }) => (
                <div className="flex items-center justify-between ~text-xs/base">
                  {option.label}
                  {selected && <Check className="pl-1 ~h-3/6 ~w-2/6" />}
                </div>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};

export default CustomSelect;
