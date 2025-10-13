import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import './SweetPagination.css';

type ServerPaginationProps = {
    totalPages: number;
    currentPage: number;
    baseUrl: string; // Base path for links, "/admin"
};

const ServerPagination: React.FC<ServerPaginationProps> = ({
    totalPages,
    currentPage,
    baseUrl,
}) => {
    if (totalPages <= 1)
        return null; // No pagination needed

    const getPaginationRange = () => {
        const delta = 2;
        const range = [];
        for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
            range.push(i);
        }
        if (currentPage > delta + 1) range.unshift('...');
        if (currentPage < totalPages - delta) range.push('...');
        if (range[0] !== 1 && range[0] !== '...') range.unshift(1);
        if (range[range.length - 1] !== totalPages && range[range.length - 1] !== '...') range.push(totalPages);
        return range;
    };

    const pageNumbers = getPaginationRange();

    return (
        <nav className="sweetPagination">
            <ul className="paginationUL">
                {/* Previous Button */}
                <li>
                    <Link href={currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : '#'}>
                        <a className={clsx('pageButton commonButtonStyle leftNavigation', { 'disabled' : currentPage === 1 })}>
                            &lt;
                        </a>
                    </Link>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map((num, idx) => (
                    <li key={idx} className="pageItem">
                        {num === '...' ? (
                            <span className="pageButton commonButtonStyle disabled">...</span>
                        ) : (
                            <Link href={`${baseUrl}?page=${num}`}>
                                <a className={currentPage === num ? "pageButton activeButton commonButtonStyle" : "pageButton commonButtonStyle"}>
                                    {num}
                                </a>
                            </Link>
                        )}
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <Link href={currentPage < totalPages ? `${baseUrl}?page=${currentPage + 1}` : "#"}>
                        <a className={clsx("pageButton commonButtonStyle rightNavigation", { "disabled": currentPage === totalPages})}>
                            &gt;
                        </a>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default ServerPagination;
