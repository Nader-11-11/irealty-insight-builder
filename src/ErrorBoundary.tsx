import React from "react";

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, info: any) { console.error("ErrorBoundary:", error, info); }
  render() {
    if (this.state.hasError) return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="text-muted-foreground">Check console logs for details.</p>
      </div>
    );
    return this.props.children;
  }
}
