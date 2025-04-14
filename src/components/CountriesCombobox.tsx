'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from 'src/lib/utils';
import { Button } from 'src/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'src/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'src/components/ui/popover';
import { countryOptions } from 'src/lib/countries';

export function CountriesCombobox(props: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          <span className="truncate">
            {props.value
              ? countryOptions.find((country) => country.label === props.value)
                  ?.label
              : 'Select country...'}
          </span>
          <ChevronsUpDown className="flex-none opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-screen p-0" onBlur={props.onBlur}>
        <Command>
          <CommandInput placeholder="Search country..." className="h-9" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryOptions.map((country) => (
                <CommandItem
                  key={country.label}
                  value={country.label}
                  onSelect={(currentValue) => {
                    props.onChange(
                      currentValue === props.value ? '' : currentValue
                    );
                    setOpen(false);
                  }}
                >
                  {country.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      props.value === country.label
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
