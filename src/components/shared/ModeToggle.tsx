"use client";

import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Check,
  Palette,
  Languages,
} from "lucide-react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "next/navigation";
import type { QueryParams } from "next-intl/navigation";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("SettingComponent");
  const currentLocale = useLocale();
  const query: QueryParams = {};

  const locales = [
    {
      code: "en",
      label: t("english"),
      flag: "🇺🇸",
    },
    {
      code: "vi",
      label: t("vietnamese"),
      flag: "🇻🇳",
    },
  ];

  const themes = [
    {
      value: "light",
      label: t("light"),
      icon: Sun,
      description: t("light_description"),
    },
    {
      value: "dark",
      label: t("dark"),
      icon: Moon,
      description: t("dark_description"),
    },
    {
      value: "system",
      label: t("system"),
      icon: Monitor,
      description: t("system_description"),
    },
  ];

  searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const handleLanguageChange = (locale: string) => {
    router.replace({ pathname, query }, { locale });
  };

  if (pathname.includes("messages")) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative group hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Settings className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 p-2 bg-background/95 backdrop-blur-md border-2 shadow-xl"
      >
        {/* Theme Section */}
        <div className="space-y-1">
          <DropdownMenuLabel className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Palette className="h-4 w-4" />
            {t("appearance")}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;

              return (
                <DropdownMenuItem
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-primary/10 hover:scale-[1.02]",
                    isSelected && "bg-primary/15 border border-primary/20"
                  )}
                >
                  <div
                    className={cn(
                      "size-8 flex items-center justify-center rounded-full transition-colors duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {themeOption.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {themeOption.description}
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary animate-in fade-in duration-200" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </div>

        <DropdownMenuSeparator className="my-3 bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Language Section */}
        <div className="space-y-1">
          <DropdownMenuLabel className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Languages className="h-4 w-4" />
            {t("language")}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {locales.map(({ code, label, flag }) => {
              const isSelected = currentLocale === code;

              return (
                <DropdownMenuItem
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200",
                    "hover:bg-primary/10 hover:scale-[1.02]",
                    isSelected && "bg-primary/15 border border-primary/20"
                  )}
                >
                  <div
                    className={cn(
                      "size-8 flex items-center justify-center rounded-full transition-colors duration-200",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {flag}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-muted-foreground">{code}</div>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary animate-in fade-in duration-200" />
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground text-center">
            {t("customize_experience")}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
