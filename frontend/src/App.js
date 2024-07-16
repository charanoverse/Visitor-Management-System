import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Aboutus from './Aboutus';
import AdminHome from './components/Admin components/AdminHome';
import AdminInfo from './components/Admin components/AdminInfo';
import AdmVisitorLogs from './components/Admin components/AdmVisitorLogs';
import AllResInfo from './components/Admin components/AllResInfo';
import DetectNumberPlate from './components/Admin components/DetectNumberPlate';
import Loginsignup from './components/Loginsignup';
import PrivateRoute from './components/PrivateRoute';
import PersonalInfo from './components/Resident components/PersonalInfo';
import ResidentHome from './components/Resident components/ResidentHome';
import ResVisitorLogs from './components/Resident components/ResVisitorLogs';
import Unauthorized from './components/Unauthorized';
import ScheduleVisit from './components/Resident components/ScheduleVisit';
import ScanQr from './components/Admin components/ScanQr';
import RecognizeFace from './components/Admin components/RecognizeFace';
import PreScheduledVisits from './components/Resident components/PreScheduledVisits';
import RecognizeFace from './components/Admin components/RecognizeFace';

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path="/" element={<Loginsignup />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/adminhome" element={<PrivateRoute allowedRoles={['Admin']}><AdminHome /></PrivateRoute>} />
        <Route path="/adminhome/admininfo" element={<PrivateRoute allowedRoles={['Admin']}><AdminInfo /></PrivateRoute>} />
        <Route path="/adminhome/visitorlogs" element={<PrivateRoute allowedRoles={['Admin']}><AdmVisitorLogs /></PrivateRoute>} />
        <Route path="/adminhome/allresinfo" element={<PrivateRoute allowedRoles={['Admin']}><AllResInfo /></PrivateRoute>} />
        <Route path="/adminhome/detectnumberplate" element={<PrivateRoute allowedRoles={['Admin']}><DetectNumberPlate /></PrivateRoute>} />
        <Route path="/adminhome/scanqrcode" element={<PrivateRoute allowedRoles={['Admin']}><ScanQr /></PrivateRoute>} />
        <Route path="/adminhome/recognizeface" element={<PrivateRoute allowedRoles={['Admin']}><RecognizeFace/></PrivateRoute>}/>


        <Route path="/residenthome" element={<PrivateRoute allowedRoles={['Resident']}><ResidentHome /></PrivateRoute>} />
        <Route path="/residenthome/personalinfo" element={<PrivateRoute allowedRoles={['Resident']}><PersonalInfo /></PrivateRoute>} />
        <Route path="/residenthome/visitorlogs" element={<PrivateRoute allowedRoles={['Resident']}><ResVisitorLogs /></PrivateRoute>} />
        <Route path="/scheduleVisit" element={<PrivateRoute allowedRoles={['Resident']}><ScheduleVisit/></PrivateRoute>} />
        <Route path="/prescheduledVisits" element={<PrivateRoute allowedRoles={['Resident']}><PreScheduledVisits/></PrivateRoute>} />



      </Routes>
    </div>
  );
}

export default App;
