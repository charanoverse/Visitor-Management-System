import { Link } from 'react-router-dom';
import './AdminHome.css';
import AdminNavbar from './AdminNavbar.jsx';

const AdminHome = () => {
  return (
    <div className="admin-home-container">
      <AdminNavbar />
      <div className="button-container">
        <Link to="/adminhome/recognizeface" className="admin-button">Recognize with Face</Link>
        <Link to="/adminhome/detectnumberplate" className="admin-button">Detect with Number Plate</Link>
        <Link to="/adminhome/scanqrcode" className="admin-button">Scan QR Code</Link>
        <Link to="/adminhome/approvemanually" className="admin-button">Approve Manually</Link>
      </div>
    </div>
  );
};

export default AdminHome;
