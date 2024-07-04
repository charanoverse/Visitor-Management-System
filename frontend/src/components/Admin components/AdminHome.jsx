import { Link } from 'react-router-dom';
import './AdminHome.css';
import AdminNavbar from './AdminNavbar.jsx';

const AdminHome = () => {
  return (
    <div className="admin-home-container">
      <AdminNavbar />
      <div className="button-container">
        <Link to="/adminhome/recognize-face" className="admin-button">Recognize with Face</Link>
        <Link to="/adminhome/detect-number-plate" className="admin-button">Detect with Number Plate</Link>
        <Link to="/adminhome/scan-qr-code" className="admin-button">Scan QR Code</Link>
        <Link to="/adminhome/approve-manually" className="admin-button">Approve Manually</Link>
      </div>
    </div>
  );
};  

export default AdminHome;
