import { useTheme } from './useTheme';

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const axisStroke = isDark ? '#94A3B8' : '#64748B';
  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.08)' : '#F1F5F9';

  return {
    isDark,
    resolvedTheme,
    axisStroke,
    axisColor: axisStroke,
    gridStroke,
    gridColor: gridStroke,
    tooltipStyle: {
      backgroundColor: isDark ? '#111A2C' : '#FFFFFF',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : '#CBD5E1',
      color: isDark ? '#F1F5F9' : '#0F172A',
      borderRadius: '12px',
      fontSize: '13px',
      boxShadow: isDark
        ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.4)'
        : '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    },
    colors: {
      collected: isDark ? '#38BDF8' : '#12305C',
      diverted: isDark ? '#34D399' : '#059669',
      recycled: isDark ? '#60A5FA' : '#0284C7',
      compost: isDark ? '#10B981' : '#059669',
      energy: isDark ? '#FBBF24' : '#D97706',
      landfill: isDark ? '#94A3B8' : '#64748B',
    },
  };
}
