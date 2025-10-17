// components/ui/ServerPagination.tsx
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import styles from './ServerPagination.module.css'; 

type ServerPaginationProps = {
  totalPages: number;
  currentPage: number;
  baseUrl: string;
  addStartingSlash: boolean | false;
  variant?: 'style-1' | 'style-2'; // Optional variant prop for styling
};

const ServerPagination: React.FC<ServerPaginationProps> = ({
  totalPages,
  currentPage,
  baseUrl,
  addStartingSlash,
  variant,
}) => {
  if (totalPages <= 1) return null;

  const getPaginationRange = () => {
    const delta = 2;
    const range: (number | string)[] = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage > delta + 2) range.unshift('...');
    if (currentPage < totalPages - delta - 1) range.push('...');
    if (range[0] !== 1 && range[0] !== '...') range.unshift(1);
    if (range[range.length - 1] !== totalPages && range[range.length - 1] !== '...') range.push(totalPages);
    return range;
  };

  const previousPaginationUrl = addStartingSlash ? `${baseUrl}/${currentPage - 1}` : `${baseUrl}${currentPage - 1}`;  
  const pageNumbersPaginationUrl = addStartingSlash ? `${baseUrl}/` : `${baseUrl}`;
  const nextPaginationUrl = addStartingSlash ? `${baseUrl}/${currentPage + 1}` : `${baseUrl}${currentPage + 1}`;

  const pageNumbers = getPaginationRange();

  return (
    <nav className={clsx(styles.serverPagination, variant && styles[variant])}>
      <ul className={styles.paginationUL}> 
        {/* Previous Button */}
        <li className={styles.pageItem}>
          <Link
            href={currentPage > 1 ? previousPaginationUrl : '#'}
            className={clsx(
              styles.pageButton,
              styles.leftNavigation, 
              { [styles.disabled]: currentPage === 1 }
            )}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : undefined}
          >
            &lt;
          </Link>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((num, idx) => (
          <li key={idx} className={styles.pageItem}>
            {num === '...' ? (
              <span className={clsx(styles.pageButton, styles.disabled)}>...</span>
            ) : (
              <Link 
                href={`${pageNumbersPaginationUrl}${num}`} 
                className={clsx(styles.pageButton, { [styles.activeButton]: currentPage === num })}
              >
                {num}
              </Link>
            )}
          </li>
        ))}

        {/* Next Button */}
        <li className={styles.pageItem}>
          <Link 
            href={currentPage < totalPages ? nextPaginationUrl : '#'} 
            className={clsx(
              styles.pageButton, 
              styles.rightNavigation,
              { [styles.disabled]: currentPage === totalPages }
            )}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : undefined}
          >
            &gt;
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default ServerPagination;