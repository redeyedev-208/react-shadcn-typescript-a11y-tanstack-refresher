import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export const LanguageToggle: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    try {
      await changeLanguage(langCode);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='gap-2'
          aria-label='Select language'
        >
          <Globe className='h-4 w-4' />
          <span className='hidden sm:inline'>
            {currentLang.flag} {currentLang.name}
          </span>
          <span className='sm:hidden'>{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='z-[9999]'
        side='bottom'
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code ? 'bg-accent' : ''
            }`}
          >
            <span className='mr-2'>{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
