import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Sparkles, ArrowUpRight, ArrowDownRight, Video, FileText, Zap } from 'lucide-react';
import { PostPerformance } from '../types';

interface PerformanceCardProps {
  type: 'top' | 'underperformer' | 'signal';
  title: string;
  subtitle: string;
  score: number;
  metricChange: string;
  isPositive: boolean;
  tag: string;
  description: string;
  delay?: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  type,
  title,
  subtitle,
  score,
  metricChange,
  isPositive,
  tag,
  description,
  delay = 0,
}) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'top':
        return 'bg-[#F1E5A1]/80 text-[#486C2F] border-[#486C2F]/30';
      case 'underperformer':
        return 'bg-[#8B2626]/12 text-[#8B2626] border-[#8B2626]/30';
      case 'signal':
        return 'bg-[#EF6905]/15 text-[#EF6905] border-[#EF6905]/35';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'top':
        return <Video className="w-4 h-4 text-[#486C2F]" />;
      case 'underperformer':
        return <FileText className="w-4 h-4 text-[#8B2626]" />;
      case 'signal':
        return <Zap className="w-4 h-4 text-[#EF6905]" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative bg-[#FFFFFF] border border-[#E8DEB7] hover:border-[#EF6905] rounded-2xl p-6 transition-all duration-200 shadow-2xs flex flex-col justify-between"
    >
      {/* Visual top indicator */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FAF6E8] border border-[#E8DEB7] flex items-center justify-center">
            {getIcon()}
          </div>
          <div>
            <div className="text-xs font-semibold text-[#2A1A18] tracking-wide uppercase">{title}</div>
            <div className="text-[11px] text-[#6A5652]">{subtitle}</div>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
          {tag}
        </span>
      </div>

      {/* Main Score Metrics */}
      <div className="my-3 py-3 border-y border-[#E8DEB7] flex items-baseline justify-between">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold text-[#2A1A18] tracking-tight font-mono">
            {score}
          </div>
          <div className="text-xs text-[#6A5652] mt-0.5">Performance Score</div>
        </div>

        <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-[#486C2F]' : 'text-[#8B2626]'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          <span>{metricChange}</span>
        </div>
      </div>

      {/* Bottom Description / Insights */}
      <p className="text-xs text-[#6A5652] leading-relaxed mt-2">
        {description}
      </p>

      {/* Simulated Preview Watermark */}
      <div className="mt-4 pt-3 border-t border-[#E8DEB7] flex items-center justify-between text-[10px] text-[#6A5652]">
        <span>INTERFACE PREVIEW</span>
        <span className="font-mono text-[#8B2626] font-semibold">GENIE-PERF-MOCK</span>
      </div>
    </motion.div>
  );
};
