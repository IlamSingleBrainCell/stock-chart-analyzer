export const calculateCAGR = (endValue, startValue, periods) => {
    if (startValue === 0 || periods <= 0 || !endValue || !startValue) return null;
    const cagr = (Math.pow(endValue / startValue, 1 / periods) - 1) * 100;
    return parseFloat(cagr.toFixed(2));
};

export const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: 'var(--highlight-background)', fontWeight: '600' }}>
                {part}
            </span>
        ) : (
            part
        )
    );
};
