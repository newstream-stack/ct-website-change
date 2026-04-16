import React from 'react';

interface ReceiptData {
  id: string;
  date: string;
  project: string;
  method: string;
  amount: string;
  name: string;
  taxId?: string;
}

interface ReceiptModalProps {
  receipt: ReceiptData;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden flex flex-col h-auto" style={{ maxHeight: '90vh' }}>
        
        {/* Receipt Action Bar (Not printed) */}
        <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200 print:hidden flex-none w-full z-30 relative" style={{ display: 'flex', height: '64px', minHeight: '64px', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-bold text-gray-700 font-sans text-sm md:text-base m-0">電子收據預覽</h3>
          <div className="flex gap-2 md:gap-4 items-center">
            <button 
              onClick={handlePrint}
              className="bg-brand-red text-white h-9 md:h-10 px-4 md:px-5 rounded-lg text-xs md:text-sm font-bold tracking-widest hover:bg-[#b31b1b] transition-all flex items-center gap-2 shadow-md whitespace-nowrap active:scale-95"
            >
              <i className="fas fa-download"></i> <span>下載 / 列印 <span className="hidden sm:inline">(.pdf)</span></span>
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-50 cursor-pointer bg-white border border-gray-100 sm:border-none"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 md:p-14 bg-white print:overflow-visible print:p-0" id="printable-receipt" style={{ minHeight: '0' }}>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-brand-red pb-4 md:pb-6 mb-6 md:mb-8 gap-4 md:gap-2">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="h-8 md:h-12 px-2.5 md:px-4 bg-brand-red text-white font-black font-serif flex items-center justify-center text-sm md:text-xl rounded-lg tracking-widest flex-shrink-0">
                IMPACT
              </div>
              <div className="flex-shrink-1">
                <h2 className="text-base md:text-xl font-serif font-black tracking-widest text-brand-red mb-0.5 md:mb-1 whitespace-normal md:whitespace-nowrap">財團法人基督教論壇基金會</h2>
                <p className="text-[10px] md:text-xs text-gray-500 tracking-widest uppercase">Donation Receipt 奉獻收據</p>
              </div>
            </div>
            <div className="text-left md:text-right text-[10px] md:text-sm font-sans text-gray-600 space-y-1 flex-shrink-0 whitespace-nowrap">
              <p><span className="font-bold text-gray-400 mr-2 uppercase tracking-widest">Receipt No.</span> R-{receipt.id}</p>
              <p><span className="font-bold text-gray-400 mr-2 uppercase tracking-widest">Date</span> {receipt.date}</p>
            </div>
          </div>

          {/* Receipt Info */}
          <h1 className="text-center font-serif text-3xl font-bold tracking-[0.2em] mb-12">電子奉獻收據</h1>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 sm:p-8 mb-4 sm:mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-12 relative">
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻者姓名 Name</p>
                 <p className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 sm:pb-2 break-all">{receipt.name}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">統一編號 Tax ID</p>
                 <p className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 sm:pb-2 break-all">{receipt.taxId || '無'}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻專案 Project</p>
                 <p className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 sm:pb-2 break-all">{receipt.project}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻方式 Method</p>
                 <p className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-1 sm:pb-2 break-all">{receipt.method}</p>
               </div>

               {/* Watermark Logo */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl">
                 <i className="fas fa-dove"></i>
               </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 bg-gray-800 text-white p-5 sm:p-6 rounded-xl">
               <div>
                 <p className="text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase mb-0.5 sm:mb-1">奉獻總金額 Total Amount</p>
                 <p className="text-[10px] sm:text-sm text-gray-300">新台幣 NTD</p>
               </div>
               <div className="text-3xl sm:text-5xl font-display font-black tracking-tight self-end sm:self-auto">
                 {receipt.amount}
               </div>
            </div>
          </div>

          {/* Footer & Stamp */}
          <div className="flex justify-between items-end mt-8 md:mt-12 pt-6 border-t border-gray-200 relative pb-16 sm:pb-0">
             <div className="text-[10px] sm:text-xs text-gray-500 leading-relaxed max-w-sm font-sans z-10 w-full sm:w-auto">
               <p className="font-bold text-gray-700 mb-1 tracking-widest">注意事項：</p>
               <ol className="list-decimal pl-4 space-y-1">
                 <li>本收據可依各國稅法規定作為抵稅憑證，請妥善保管。</li>
                 <li>如對本收據內容有任何疑問，請聯繫本會客服中心。</li>
               </ol>
             </div>
             <div className="absolute sm:relative bottom-0 right-[-10px] sm:right-auto opacity-30 sm:opacity-100 pointer-events-none z-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-red-600/30 flex items-center justify-center transform rotate-12 bg-white">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border border-red-600/30 flex flex-col items-center justify-center text-red-600/50">
                    <span className="font-serif font-black tracking-[0.2em] sm:tracking-widest text-xs sm:text-base">IMPACT</span>
                    <span className="text-[8px] sm:text-[10px] font-bold tracking-widest leading-tight text-center">財團法人基督教論壇基金會</span>
                    <span className="text-[8px] sm:text-[10px] font-sans mt-0.5 sm:mt-1">財務專用章</span>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt, #printable-receipt * {
            visibility: visible;
          }
          #printable-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100vh;
            padding: 2cm !important;
            box-sizing: border-box;
          }
        }
      `}} />
    </div>
  );
}
