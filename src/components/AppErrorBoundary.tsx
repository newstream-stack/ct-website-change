import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    // Connect a privacy-safe error reporter here in production. Do not include tokens or form values.
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-theme-bg text-theme-text px-6">
        <div className="max-w-md text-center">
          <h1 className="font-serif text-3xl font-black mb-4">頁面暫時無法顯示</h1>
          <p className="text-sm text-theme-text/55 mb-8">請重新載入頁面；若問題持續發生，請聯絡客服。</p>
          <button type="button" onClick={() => window.location.reload()} className="bg-brand-red text-white px-7 py-3 text-sm font-bold tracking-widest rounded-sm">
            重新載入
          </button>
        </div>
      </main>
    );
  }
}
