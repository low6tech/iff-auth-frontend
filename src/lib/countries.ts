import Countries from 'src/constants/countries.json';
import Flags from 'src/constants/flags-64x64.json';

interface CountryOption {
  flagUri: string | undefined;
  label: string;
}

export const countryOptions: CountryOption[] = Countries.map((country) => ({
  flagUri: Flags[country.alpha2 as keyof typeof Flags],
  label: country.en,
}));
