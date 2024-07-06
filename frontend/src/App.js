import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Aboutus from './Aboutus';
import AdminHome from './components/Admin components/AdminHome';
import Loginsignup from './components/Loginsignup';
import ResidentHome from './components/Resident components/ResidentHome';
import PersonalInfo from './components/Resident components/PersonalInfo';
import ResVisitorLogs from './components/Resident components/VisitorLogs';
import AdminInfo from './components/Admin components/AdminInfo';
import AdmVisitorLogs from './components/Admin components/AdmVisitorLogs';
import AllResInfo from './components/Admin components/AllResInfo';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import DetectNumberPlate from './components/Admin components/DetectNumberPlate';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route path="/" Component={Loginsignup}/>
        <Route path="/aboutus" element={<Aboutus/>}/>
        <Route path="/unauthorized" element={<Unauthorized/>}/>

        <Route path="/adminhome" element={<PrivateRoute allowedRoles={['Admin']}><AdminHome/></PrivateRoute>}/>
        <Route path="/adminhome/admininfo" element={<PrivateRoute allowedRoles={['Admin']}><AdminInfo/></PrivateRoute>}/>
        <Route path="/adminhome/visitorlogs" element={<PrivateRoute allowedRoles={['Admin']}><AdmVisitorLogs/></PrivateRoute>}/>
        <Route path="/adminhome/allresinfo" element={<PrivateRoute allowedRoles={['Admin']}><AllResInfo/></PrivateRoute>}/>
        <Route path="/adminhome/detectnumberplate" element={<PrivateRoute allowedRoles={['Admin']}><DetectNumberPlate/></PrivateRoute>}/>


        <Route path="/residenthome" element={<PrivateRoute allowedRoles={['Resident']}><ResidentHome/></PrivateRoute>}/>
        <Route path="/residenthome/personalinfo" element={<PrivateRoute allowedRoles={['Resident']}><PersonalInfo/></PrivateRoute>}/>
        <Route path="/residenthome/visitorlogs" element={<PrivateRoute allowedRoles={['Resident']}><ResVisitorLogs/></PrivateRoute>}/>
        

      </Routes>
    </div>
  );
}

export default App;
