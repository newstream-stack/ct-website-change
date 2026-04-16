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
      
      <div className="relative w-full max-w-2xl bg-white text-black rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Receipt Action Bar (Not printed) */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200 print:hidden">
          <h3 className="font-bold text-gray-700 font-sans">電子收據預覽</h3>
          <div className="flex gap-4">
            <button 
              onClick={handlePrint}
              className="bg-brand-red text-white px-5 py-2 rounded-lg text-sm font-bold tracking-widest hover:bg-brand-red/90 transition-colors flex items-center gap-2"
            >
              <i className="fas fa-download"></i> 下載 / 列印 (.pdf)
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Receipt Content */}
        <div className="p-8 sm:p-12 overflow-y-auto bg-white print:p-0" id="printable-receipt">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-brand-red pb-6 mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-red text-white font-black font-serif flex items-center justify-center text-xl rounded-lg">
                IMPACT
              </div>
              <div>
                <h2 className="text-2xl font-serif font-black tracking-widest text-brand-red mb-1">財團法人基督教論壇基金會</h2>
                <p className="text-xs text-gray-500 tracking-widest uppercase">Donation Receipt 奉獻收據</p>
              </div>
            </div>
            <div className="text-left sm:text-right text-sm font-sans text-gray-600 space-y-1">
              <p><span className="font-bold text-gray-400 mr-2 uppercase text-[10px] tracking-widest">Receipt No.</span> R-{receipt.id}</p>
              <p><span className="font-bold text-gray-400 mr-2 uppercase text-[10px] tracking-widest">Date</span> {receipt.date}</p>
            </div>
          </div>

          {/* Receipt Info */}
          <h1 className="text-center font-serif text-3xl font-bold tracking-[0.2em] mb-12">電子奉獻收據</h1>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-8 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 relative">
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻者姓名 Name</p>
                 <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{receipt.name}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">統一編號 Tax ID</p>
                 <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{receipt.taxId || '無'}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻專案 Project</p>
                 <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{receipt.project}</p>
               </div>
               <div className="space-y-1">
                 <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">奉獻方式 Method</p>
                 <p className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">{receipt.method}</p>
               </div>

               {/* Watermark Logo */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none text-9xl">
                 <i className="fas fa-dove"></i>
               </div>
            </div>

            <div className="mt-8 flex justify-between items-end bg-gray-800 text-white p-6 rounded-xl">
               <div>
                 <p className="text-xs text-gray-400 tracking-widest uppercase mb-1">奉獻總金額 Total Amount</p>
                 <p className="text-sm text-gray-300">新台幣 NTD</p>
               </div>
               <div className="text-4xl sm:text-5xl font-display font-black tracking-tight">
                 {receipt.amount}
               </div>
            </div>
          </div>

          {/* Footer & Stamp */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-12 pt-6 border-t border-gray-200 gap-8">
             <div className="text-xs text-gray-500 leading-relaxed max-w-sm font-sans order-2 sm:order-1">
               <p className="font-bold text-gray-700 mb-1 tracking-widest">注意事項：</p>
               <ol className="list-decimal pl-4 space-y-1">
                 <li>本收據可依各國稅法規定作為抵稅憑證，請妥善保管。</li>
                 <li>如對本收據內容有任何疑問，請聯繫本會客服中心。</li>
                 <li>願神大大賜福您，成為全地的祝福。</li>
               </ol>
             </div>
             <div className="relative order-1 sm:order-2">
                <div className="w-32 h-32 rounded-full border-4 border-red-600/30 flex items-center justify-center transform rotate-12 bg-white pointer-events-none">
                  <div className="w-28 h-28 rounded-full border border-red-600/30 flex flex-col items-center justify-center text-red-600/50">
                    <span className="font-serif font-black tracking-widest">IMPACT</span>
                    <span className="text-[10px] font-bold tracking-widest">財團法人基督教論壇基金會</span>
                    <span className="text-[10px] font-sans mt-1">財務專用章</span>
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
