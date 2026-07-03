import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur attrapée par le périmètre d\'erreur:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-2xl text-center border-t-4 border-amber-500">
            <h1 className="title-font text-3xl md:text-5xl font-bold text-blue-900 mb-6">Oups, un imprévu !</h1>
            <p className="text-slate-600 mb-8 text-lg">
              Une erreur inattendue s'est produite lors du chargement de cette page. Notre équipe technique en a été informée.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-4 bg-blue-900 text-white font-semibold rounded-full hover:bg-blue-800 transition w-full sm:w-auto"
              >
                Rafraîchir la page
              </button>
              <Link 
                to="/" 
                className="px-8 py-4 border-2 border-blue-900 text-blue-900 font-semibold rounded-full hover:bg-slate-50 transition w-full sm:w-auto"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
