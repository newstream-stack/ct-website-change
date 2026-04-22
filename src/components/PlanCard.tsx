import React from 'react';
import { ActionPlan } from '../types';

interface PlanCardProps {
  plan: ActionPlan;
  isSelected?: boolean;
  onClick?: () => void;
}

// 樣式變數化，增強可讀性
const BASE_CARD_STYLE = "group border p-6 md:p-8 cursor-pointer rounded-sm transition-colors duration-500 relative";

// 根據不同情況的卡片樣式
const getCardStyle = (variant: string, isPremium?: boolean, isSelected?: boolean) => {
  if (variant === 'subscription') {
    if (isPremium) {
      return `${BASE_CARD_STYLE} border-brand-red bg-brand-red/10 hover:bg-brand-red hover:text-white`;
    }
    return `${BASE_CARD_STYLE} border-theme-text/20 bg-theme-text/5 hover:bg-theme-text hover:text-theme-bg`;
  }
  
  // donation variant
  return isSelected
    ? `${BASE_CARD_STYLE} border-brand-red bg-brand-red/10`
    : `${BASE_CARD_STYLE} border-theme-text/20 bg-theme-text/5 hover:bg-theme-text/10`;
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onClick }) => {
  const { title, subtitle, price, description, isPremium, variant } = plan;
  const isDonation = variant === 'donation';
  const cardClassName = getCardStyle(variant, isPremium, isSelected);

  return (
    <div className={cardClassName} onClick={onClick}>
      {/* 標籤Badge：高級訂閱或被選中的捐款選項 */}
      {(isPremium || (isDonation && isSelected)) && (
        <div className={`absolute top-4 right-4 text-[10px] font-display uppercase tracking-widest border border-current px-2 py-1 ${
          isPremium ? 'text-brand-red group-hover:text-white' : 'text-brand-red'
        }`}>
          {isPremium ? 'Premium' : 'Selected'}
        </div>
      )}

      {/* 標題與價格/副標題區塊 */}
      <div className={`flex ${isDonation ? 'flex-col mb-2' : 'flex-col sm:flex-row sm:justify-between sm:items-end mb-4 gap-2 mt-4 sm:mt-0'}`}>
        <h3 className={`text-2xl md:text-3xl ${!isDonation && 'md:text-4xl'} font-serif font-black transition-colors ${
          !isDonation && isPremium ? 'text-theme-text group-hover:text-white' : 'text-theme-text'
        } ${!isDonation && !isPremium && 'group-hover:text-theme-bg'}`}>
          {title}
        </h3>
        
        {isDonation && subtitle && (
          <span className="font-display text-[10px] md:text-xs tracking-[0.2em] uppercase text-theme-text/60 mt-2">
            {subtitle}
          </span>
        )}
        
        {!isDonation && price && (
          <span className={`text-2xl font-display font-bold transition-colors ${
            isPremium ? 'text-brand-red group-hover:text-white' : 'text-brand-red'
          }`}>
            {price}
          </span>
        )}
      </div>

      {/* 敘述文字 */}
      <p className={`font-light text-sm md:text-base mt-4 transition-colors ${
        !isDonation && isPremium ? 'opacity-90 text-theme-text group-hover:text-white' : 'opacity-80 text-theme-text'
      } ${!isDonation && !isPremium && 'opacity-70 group-hover:opacity-90 group-hover:text-theme-bg'} ${!isDonation && 'mt-0'}`}>
        {description}
      </p>
    </div>
  );
};

export default PlanCard;
