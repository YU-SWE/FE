export const Input = ({ className = '', ...props }) => (
    <input
        className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
        {...props}
    />
);