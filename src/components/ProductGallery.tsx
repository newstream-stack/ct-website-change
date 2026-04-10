export default function ProductGallery() {
  return (
    <div className="pt-24 md:pt-32 min-h-screen flex flex-col bg-theme-bg text-theme-text transition-colors duration-500">
      <div className="px-6 md:px-12 lg:px-20 mb-8 md:mb-12 flex justify-between items-end border-b border-theme-text/20 pb-6 md:pb-10 transition-colors">
          <div>
              <h1 className="text-6xl md:text-[120px] font-serif font-black leading-none text-theme-text tracking-tighter transition-colors">PRODUCT.</h1>
              <p className="text-lg md:text-2xl font-light text-theme-text/60 mt-2 font-serif italic transition-colors">Faith integrated into aesthetic objects.</p>
          </div>
          <div className="hidden md:flex gap-4">
              <button className="w-12 h-12 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/60 hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition"><i className="fas fa-arrow-left"></i></button>
              <button className="w-12 h-12 rounded-full border border-theme-text/30 flex items-center justify-center text-theme-text/60 hover:bg-theme-text hover:text-theme-bg hover:border-theme-text transition"><i className="fas fa-arrow-right"></i></button>
          </div>
      </div>
      
      <div className="gallery-track flex gap-6 md:gap-12 px-6 md:px-12 lg:px-20 pb-20 flex-grow items-center">
          <div className="gallery-item w-[85vw] md:w-[400px] flex-shrink-0 group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-theme-text/5 relative overflow-hidden mb-6 border border-theme-text/10 rounded-sm transition-colors">
                  <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-70 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="Product 1" />
                  <div className="absolute top-6 left-6 font-display text-4xl font-black text-theme-text/30 transition-colors">01</div>
                  <div className="absolute inset-0 bg-theme-text/0 group-hover:bg-theme-text/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all font-display font-bold uppercase tracking-widest bg-theme-bg px-6 py-3 text-theme-text text-sm rounded-sm">View Item</span>
                  </div>
              </div>
              <div className="flex justify-between items-start border-t border-theme-text/20 pt-4 transition-colors">
                  <h3 className="font-serif font-black text-2xl text-theme-text transition-colors">Devotion Classic</h3>
                  <span className="font-display font-bold text-xl text-brand-red">NT$ 450</span>
              </div>
          </div>

          <div className="gallery-item w-[85vw] md:w-[400px] flex-shrink-0 group cursor-pointer border border-theme-text/20 bg-theme-text/5 relative overflow-hidden flex flex-col items-center justify-center p-8 text-center hover:border-brand-red/50 transition-colors aspect-[3/4] mb-12 mt-6">
              <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" alt="Ad" />
              <div className="absolute inset-0 bg-gradient-to-b from-theme-bg/80 to-theme-bg/95 transition-colors"></div>
              <span className="absolute top-4 right-4 text-[9px] font-display uppercase tracking-widest text-theme-text/50 border border-theme-text/20 px-2 py-0.5 z-10 bg-theme-bg transition-colors">ADVERTISEMENT</span>
              <div className="relative z-10 w-20 h-20 rounded-full bg-brand-red/20 flex items-center justify-center mb-6 border border-brand-red/30 text-brand-red group-hover:scale-110 transition-transform duration-500">
                  <i className="fas fa-gem text-3xl"></i>
              </div>
              <h3 className="relative z-10 font-serif font-black text-3xl text-theme-text mb-2 transition-colors">Art Fair 2026</h3>
              <p className="relative z-10 font-light text-sm text-theme-text/70 mb-8 transition-colors">Discover faith through modern aesthetics and curated exhibitions.</p>
              <button className="relative z-10 font-display font-bold uppercase tracking-widest text-[10px] border border-theme-text/30 px-6 py-3 text-theme-text hover:bg-theme-text hover:text-theme-bg transition">Get Tickets</button>
          </div>

          <div className="gallery-item w-[85vw] md:w-[400px] flex-shrink-0 group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-theme-text/5 relative overflow-hidden mb-6 border border-theme-text/10 rounded-sm transition-colors">
                  <img src="https://images.unsplash.com/photo-1600697395543-ef3ee6e9af7b?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-70 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="Product 2" />
                  <div className="absolute top-6 left-6 font-display text-4xl font-black text-theme-text/30 transition-colors">02</div>
                  <div className="absolute inset-0 bg-theme-text/0 group-hover:bg-theme-text/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all font-display font-bold uppercase tracking-widest bg-theme-bg px-6 py-3 text-theme-text text-sm rounded-sm">View Item</span>
                  </div>
              </div>
              <div className="flex justify-between items-start border-t border-theme-text/20 pt-4 transition-colors">
                  <h3 className="font-serif font-black text-2xl text-theme-text transition-colors">Silver Cross</h3>
                  <span className="font-display font-bold text-xl text-brand-red">NT$ 1,280</span>
              </div>
          </div>
          
          <div className="gallery-item w-[85vw] md:w-[400px] flex-shrink-0 group cursor-pointer">
              <div className="w-full aspect-[3/4] bg-theme-text/5 relative overflow-hidden mb-6 border border-theme-text/10 rounded-sm transition-colors">
                  <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover opacity-70 grayscale group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="Product 3" />
                  <div className="absolute top-6 left-6 font-display text-4xl font-black text-theme-text/30 transition-colors">03</div>
                  <div className="absolute inset-0 bg-theme-text/0 group-hover:bg-theme-text/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all font-display font-bold uppercase tracking-widest bg-theme-bg px-6 py-3 text-theme-text text-sm rounded-sm">View Item</span>
                  </div>
              </div>
              <div className="flex justify-between items-start border-t border-theme-text/20 pt-4 transition-colors">
                  <h3 className="font-serif font-black text-2xl text-theme-text transition-colors">Grace Tote Bag</h3>
                  <span className="font-display font-bold text-xl text-brand-red">NT$ 390</span>
              </div>
          </div>
          <div className="w-[10vw] md:w-[100px] flex-shrink-0"></div>
      </div>
    </div>
  );
}
