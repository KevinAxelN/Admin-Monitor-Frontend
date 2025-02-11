import { CircularProgress } from "@mui/material";

const LoadingOverlay = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
      <CircularProgress size={50} color="inherit" />
    </div>
  );
};

export default LoadingOverlay;