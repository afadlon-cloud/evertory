// Common styling patterns used across the application

export const buttonStyles = {
  primary: "bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200",
  secondary: "bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-medium text-sm uppercase tracking-wide hover:bg-gray-200 transition-all duration-200",
  danger: "bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wide shadow-sm hover:shadow-md transition-all duration-200"
};

export const cardStyles = {
  base: "bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200",
  minimal: "bg-white rounded-2xl border border-gray-100 shadow-sm"
};

export const inputStyles = {
  base: "w-full px-6 py-4 border border-gray-200 rounded-2xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200 text-lg",
  small: "w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all duration-200"
};

export const textStyles = {
  heading: {
    h1: "text-5xl font-light text-gray-900 mb-6 tracking-tight",
    h2: "text-3xl font-light text-gray-900 mb-4 tracking-tight", 
    h3: "text-xl font-light text-gray-900 mb-3"
  },
  body: {
    large: "text-lg text-gray-600 leading-relaxed",
    base: "text-gray-600 leading-relaxed",
    small: "text-sm text-gray-500 font-medium"
  }
};

export const iconStyles = {
  container: "w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center",
  small: "w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center",
  icon: "h-8 w-8 text-gray-600",
  iconSmall: "h-6 w-6 text-gray-600"
};

export const loadingStyles = {
  spinner: "animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900",
  spinnerSmall: "animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-900"
};
