import { useLanguage } from '../context/LanguageContext';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  const { t } = useLanguage();

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '24px',
      fontFamily: `'Noto Serif JP', serif`,
    },
    button: {
      padding: '8px 16px',
      margin: '0 8px',
      fontSize: '14px',
      fontWeight: 600,
      color: 'white',
      backgroundColor: '#C73E3A',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontFamily: `'Noto Serif JP', serif`,
    },
    disabledButton: {
      backgroundColor: '#A8A9AD',
      cursor: 'not-allowed',
    },
    pageInfo: {
      color: '#4B4E6D',
      fontWeight: 600,
      fontFamily: `'Noto Serif JP', serif`,
    },
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < lastPage) {
      onPageChange(currentPage + 1);
    }
  };

  if (lastPage <= 1) {
    return null;
  }

  return (
    <div style={styles.container}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.disabledButton : {}),
        }}
      >
        {t.previous ?? 'Previous'}
      </button>
      <span style={styles.pageInfo}>
        {t.pageInfo
          ? t.pageInfo.replace('{current}', String(currentPage)).replace('{last}', String(lastPage))
          : `Page ${currentPage} of ${lastPage}`}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === lastPage}
        style={{
          ...styles.button,
          ...(currentPage === lastPage ? styles.disabledButton : {}),
        }}
      >
        {t.next ?? 'Next'}
      </button>
    </div>
  );
}
