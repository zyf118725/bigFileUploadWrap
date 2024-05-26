import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'


export default function useRoute() {
  // 路由跳转
  const navigate = useNavigate();
  const goto = (url: string) => navigate(url);

  // 获取路由参数
  const [getParams] = useSearchParams(); // 结构名字随便起
  const getPageParams = (name: string) => getParams.get('id');

  return { goto, getPageParams };
}


