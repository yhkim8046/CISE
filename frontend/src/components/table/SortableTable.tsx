import React, { useState, useMemo } from "react";
import styles from './SortableTable.module.css';

interface SortableTableProps {
    headers: { key: string; label: string }[];
    data: Record<string, any>[];
    searchTerm?: string;
    showActions?: boolean;
    onApprove?: (id: string) => void;
    onReject?: (id: string) => void;
}

const SortableTable: React.FC<SortableTableProps> = ({
    headers,
    data,
    searchTerm = '',
    showActions = false,
    onApprove,
    onReject,
}) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);

    const filteredData = searchTerm
        ? data.filter(article =>
            headers.some(header => {
                const value = article[header.key];
                return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
            })
        )
        : data;

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

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

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {headers.map(header => (
                        <th key={header.key} onClick={() => requestSort(header.key)}>
                            {header.label} {sortConfig?.key === header.key ? (sortConfig.direction === 'ascending' ? '↑' : '↓') : ''}
                        </th>
                    ))}
                    {showActions && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {sortedData.map(article => (
                    <tr key={article.id}>
                        {headers.map(header => (
                            <td key={header.key}>
                                {article[header.key]}
                            </td>
                        ))}
                        {showActions && (
                            <td>
                                {onApprove && <button onClick={() => onApprove(article.id)} className={styles.approveButton}>Approve</button>}
                                {onReject && <button onClick={() => onReject(article.id)} className={styles.rejectButton}>Reject</button>}
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SortableTable;
