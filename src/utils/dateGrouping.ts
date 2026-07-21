/**
 * Utilities for grouping items by month based on a date field.
 *
 * Used in ExpensesPage tables to render month separator rows
 * between grouped items.
 */

export interface MonthGroup<T> {
    monthKey: string;      // "YYYY-MM" format for stable sorting/keying
    year: number;
    month: number;         // 1-12
    items: T[];
    total: number;         // sum of amounts across items in this month
}

/**
 * Groups items by month based on a date field (local timezone).
 * Returns an array sorted newest month -> oldest.
 * Fills gaps between the earliest and latest active month with empty groups (total=0).
 * Does NOT pad months before the earliest activity or after the latest.
 *
 * @param items Array of items to group
 * @param getDate Function extracting the ISO date string from each item
 * @param getAmount Function extracting the amount from each item (for month totals)
 */
export function groupByMonth<T>(
    items: T[],
    getDate: (item: T) => string,
    getAmount: (item: T) => number
): MonthGroup<T>[] {
    if (items.length === 0) return [];

    // Bucket items into a Map keyed by "YYYY-MM"
    const bucketed = new Map<string, T[]>();

    for (const item of items) {
        const date = new Date(getDate(item));
        // Local timezone: getFullYear/getMonth (not UTC variants)
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth is 0-indexed
        const key = `${year}-${String(month).padStart(2, "0")}`;

        if (!bucketed.has(key)) bucketed.set(key, []);
        bucketed.get(key)!.push(item);
    }

    // Determine the range of active months (earliest -> latest)
    const activeKeys = Array.from(bucketed.keys()).sort(); // ascending
    const earliestKey = activeKeys[0];
    const latestKey = activeKeys[activeKeys.length - 1];

    const [earliestYear, earliestMonth] = earliestKey.split("-").map(Number);
    const [latestYear, latestMonth] = latestKey.split("-").map(Number);

    // Walk from latest -> earliest, filling in empty months as we go
    const result: MonthGroup<T>[] = [];
    let cursorYear = latestYear;
    let cursorMonth = latestMonth;

    while (
        cursorYear > earliestYear ||
        (cursorYear === earliestYear && cursorMonth >= earliestMonth)
        ) {
        const cursorKey = `${cursorYear}-${String(cursorMonth).padStart(2, "0")}`;
        const monthItems = bucketed.get(cursorKey) ?? [];
        const total = monthItems.reduce((sum, item) => sum + getAmount(item), 0);

        result.push({
            monthKey: cursorKey,
            year: cursorYear,
            month: cursorMonth,
            items: monthItems,
            total,
        });

        // Step one month backwards
        cursorMonth--;
        if (cursorMonth === 0) {
            cursorMonth = 12;
            cursorYear--;
        }
    }

    return result;
}

/**
 * Formats a month + year as a localized "Month YYYY" string.
 * Uses the browser's current locale (e.g., "July 2026" or "Ιούλιος 2026").
 */
export function formatMonthLabel(year: number, month: number, locale?: string): string {
    // Day 1 is arbitrary — we only care about month/year formatting
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}