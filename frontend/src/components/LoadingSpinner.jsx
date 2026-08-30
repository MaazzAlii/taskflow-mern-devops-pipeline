export default function LoadingSpinner({ message = 'Loading TaskFlow...' }) {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p className="spinner-message">{message}</p>
    </div>
  );
}
