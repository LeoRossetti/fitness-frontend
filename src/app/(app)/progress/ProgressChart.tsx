import { Progress } from '@/types/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  data: Progress[];
  title: string;
  category: string;
  unit: string;
}

export default function ProgressChart({ data, title, category, unit }: ProgressChartProps) {
  // Фильтруем данные по категории и сортируем по дате
  const chartData = data
    .filter(item => item.category === category)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-gray-500">
          No data available for {category}
        </div>
      </div>
    );
  }

  // Вычисляем прогресс
  const firstValue = Number(chartData[0]?.value) || 0;
  const lastValue = Number(chartData[chartData.length - 1]?.value) || 0;
  const change = lastValue - firstValue;
  const changePercent = firstValue > 0 ? (change / firstValue) * 100 : 0;

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {/* Статистика */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{lastValue}</div>
          <div className="text-sm text-gray-500">Current {unit}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{firstValue}</div>
          <div className="text-sm text-gray-500">Starting {unit}</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            {change > 0 ? '+' : ''}{change.toFixed(1)}
          </div>
          <div className="text-sm text-gray-500">Change {unit}</div>
        </div>
      </div>

      {/* Процент изменения */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${change > 0 ? 'bg-green-500' : change < 0 ? 'bg-red-500' : 'bg-gray-400'}`}
            style={{ width: `${Math.min(Math.abs(changePercent), 100)}%` }}
          ></div>
        </div>
      </div>

      {/* История измерений */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">History</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {chartData.slice(-5).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {new Date(item.date).toLocaleDateString()}
              </span>
              <span className="font-medium">{item.value} {unit}</span>
              {item.notes && (
                <span className="text-xs text-gray-500 truncate max-w-20" title={item.notes}>
                  {item.notes}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 