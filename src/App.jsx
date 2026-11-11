import { Route, Routes } from 'react-router'
import Layout from './layout/Layout.jsx'
import Overview from './pages/Overview/Overview.jsx'
import MaterialList from './pages/MaterialList/MaterialList.jsx'
import MaterialDetail from './pages/MaterialDetail/MaterialDetail.jsx'
import MaterialForm from './pages/MaterialForm/MaterialForm.jsx'
import AssetLibrary from './pages/AssetLibrary/AssetLibrary.jsx'
import VideoList from './pages/VideoList/VideoList.jsx'
import VideoDetail from './pages/VideoDetail/VideoDetail.jsx'
import VideoForm from './pages/VideoForm/VideoForm.jsx'
import Account from './pages/Account/Account.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Overview />} />
        <Route path="materials" element={<MaterialList />} />
        <Route path="materials/new" element={<MaterialForm />} />
        <Route path="materials/:id" element={<MaterialDetail />} />
        <Route path="materials/:id/edit" element={<MaterialForm />} />
        <Route path="assets" element={<AssetLibrary />} />
        <Route path="videos" element={<VideoList />} />
        <Route path="videos/new" element={<VideoForm />} />
        <Route path="videos/:id" element={<VideoDetail />} />
        <Route path="videos/:id/edit" element={<VideoForm />} />
        <Route path="account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
