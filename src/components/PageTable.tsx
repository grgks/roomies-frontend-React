import type { ReactNode } from "react";

interface PageTableProps {
    title: string;
    color: "indigo" | "violet" | "blue" | "green" | "rose";
    columns: string[];
    emptyMessage?: string;
    isEmpty: boolean;
    children: ReactNode;
    tableId?: string;
    maxHeight?: string;
    minWidth?: string;
}

const colorMap = {
    indigo: {
        header: "bg-indigo-600",
        subheader: "bg-indigo-50",
        text: "text-indigo-700",
    },
    violet: {
        header: "bg-violet-600",
        subheader: "bg-violet-50",
        text: "text-violet-700",
    },
    blue: {
        header: "bg-blue-600",
        subheader: "bg-blue-50",
        text: "text-blue-700",
    },
    green: {
        header: "bg-green-600",
        subheader: "bg-green-50",
        text: "text-green-700",
    },
    rose: {
        header: "bg-rose-600",
        subheader: "bg-rose-50",
        text: "text-rose-700",
    },
};

const PageTable = ({ title,
                       color,
                       columns,
                       emptyMessage = "No data yet.",
                       isEmpty,
                       children,
                       tableId, maxHeight,
                       minWidth = "640px",
                   }: PageTableProps) => {
    const colors = colorMap[color];

    return (
        <div id={tableId} className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className={`${colors.header} px-5 py-4`}>
                <h2 className="text-white font-semibold text-lg">{title}</h2>
            </div>
            {isEmpty ? (
                <p className="text-slate-400 text-center py-8">{emptyMessage}</p>
            ) : (
                <div
                    className="overflow-x-auto"
                    style={{
                        maxHeight: maxHeight ?? undefined,
                        overflowY: maxHeight ? "auto" : undefined,
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <table className="w-full text-sm" style={{ minWidth }}>
                        <thead className={`${colors.subheader} sticky top-0 z-10`}>
                        <tr>
                            {columns.map((col, i) => (
                                <th key={col || `col-${i}`} className={`px-5 py-3 text-left font-medium whitespace-nowrap ${colors.text}`}>
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {children}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PageTable;