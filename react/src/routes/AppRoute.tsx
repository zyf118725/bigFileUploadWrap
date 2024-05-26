import React, { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import { routerConfig } from './index'

export default function AppRoute() {
  const BigFileUpload = lazy(() => import('@/pages/BigFileUpload'))

  useEffect(() => { }, [])
  return (
    <Router>
      <Suspense fallback={<p>loading...</p>}>
        <Routes>
          <Route path="/" element={<Navigate to={routerConfig?.defaultRoute} replace />} />
          <Route path="/bigFileUpload" element={<BigFileUpload />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
