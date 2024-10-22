import React, { useState, useMemo } from "react";
import styles from './SortableTable.module.css';

interface SortableTableProps {
    headers: { key: string; label: string }[];
    data: Record<string, any>[];
    searchTerm?: string;
    showActions?: boolean;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
    children?: React.ReactNode; // Allow passing children
}

const SortableTable: React.FC<SortableTableProps> = ({
    headers,
    data,
    searchTerm = '',
    showActions = false,
    onApprove,
    onReject,
    children,
}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

    // Filtering based on the search term
    const filteredData = useMemo(() => {
        return searchTerm
            ? data.filter(article =>
                headers.some(header => {
                    const value = article[header.key];
                    return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
                })
            )
            : data;
    }, [data, headers, searchTerm]);

    // Sorting the filtered data
const sortedData = useMemo(() => {
    const sortableItems = [...filteredData];
    if (sortConfig) {
        sortableItems.sort((a, b) => {
            const aValue = sortConfig.key === 'submissionDate' ? new Date(a[sortConfig.key]) : a[sortConfig.key];
            const bValue = sortConfig.key === 'submissionDate' ? new Date(b[sortConfig.key]) : b[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
}, [filteredData, sortConfig]);


    // Handle sorting request
    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key) {
            direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header.key} onClick={() => requestSort(header.key)} style={{ cursor: 'pointer' }}>
                            {header.label} {sortConfig?.key === header.key ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                        </th>
                    ))}
                    {showActions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {sortedData.length > 0 ? (
                    sortedData.map((article, index) => (
                        <tr key={article._id || index}>
                            {headers.map(header => (
                                <td key={`${article._id}-${header.key}`}>
                                    {header.key === 'status' ? (
                                        <div className={styles.statusContainer}>
                                            <span>{article[header.key]}</span>
                                        </div>
                                    ) : header.key === 'rating' ? (
                                        <div className={styles.ratingContainer}>
                                            <span>{article[header.key]}</span>
                                        </div>
                                    ) : (
                                        article[header.key]
                                    )}
                                </td>
                            ))}
                            {showActions && (
                                <td>
                                    <button onClick={() => onApprove?.(article._id)}>Approve</button>
                                    <button onClick={() => onReject?.(article._id)}>Reject</button>
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={headers.length + (showActions ? 1 : 0)}>No data available</td>
                    </tr>
                )}
                {React.Children.map(children, child => (
                    <tr>{child}</tr> // Wrap each child in a <tr> to prevent whitespace issues
                ))}
            </tbody>
        </table>
    );
};

export default SortableTable;
