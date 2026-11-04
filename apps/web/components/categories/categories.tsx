import {
  CATEGORIES_PATH,
  FEATURED_CATEGORIES,
  MOBILE_VISIBLE_CATEGORY_COUNT,
  TOTAL_CATEGORY_COUNT,
} from "@orchestra/shared/constants/categories";
import { SEARCH_PATH } from "@orchestra/shared/constants/navigation";
import { useLocale, useTranslations } from "next-intl";
import { CategoryTile } from "@/components/categories/category-tile";
import { ViewAllCategoriesLink } from "@/components/categories/view-all-categories-link";
import { SectionHeader } from "@/components/section-header/section-header";
import { localizeHref } from "@/i18n/localize-href";

const CATEGORIES_HEADING_ID = "categories-heading";

export function Categories() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const searchHref = localizeHref(SEARCH_PATH, locale);
  const viewAllHref = localizeHref(CATEGORIES_PATH, locale);
  const viewAllLabel = t("viewAll", { count: TOTAL_CATEGORY_COUNT });

  return (
    <section
      aria-labelledby={CATEGORIES_HEADING_ID}
      className="border-border scroll-mt-24 border-t"
      id="services"
    >
      <div className="max-w-page px-page mx-auto flex w-full flex-col gap-7 py-16 lg:gap-14 lg:py-30">
        <SectionHeader
          aside={
            <ViewAllCategoriesLink
              className="hidden lg:flex"
              href={viewAllHref}
              label={viewAllLabel}
              variant="underline"
            />
          }
          eyebrow={t("eyebrow")}
          headingId={CATEGORIES_HEADING_ID}
          title={t.rich("title", {
            emphasis: (chunks) => <em>{chunks}</em>,
          })}
        />

        <ul className="border-border grid grid-cols-2 border-t border-l lg:grid-cols-4">
          {FEATURED_CATEGORIES.map((category, index) => (
            <CategoryTile
              businessCountLabel={t("businessCount", {
                count: category.businessCount,
              })}
              categoryKey={category.key}
              className={
                index >= MOBILE_VISIBLE_CATEGORY_COUNT
                  ? "max-lg:hidden"
                  : undefined
              }
              href={`${searchHref}?category=${category.slug}`}
              index={index}
              key={category.key}
              label={t(`items.${category.key}`)}
            />
          ))}
        </ul>

        <ViewAllCategoriesLink
          className="lg:hidden"
          href={viewAllHref}
          label={viewAllLabel}
          variant="button"
        />
      </div>
    </section>
  );
}
