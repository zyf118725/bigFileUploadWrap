import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/assets/common.less';
import AppRoute from '@/routes/AppRoute';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(< AppRoute />);