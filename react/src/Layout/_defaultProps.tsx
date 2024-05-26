import {
  ChromeFilled,
  CrownFilled,
  SmileFilled,
  TabletFilled,
} from '@ant-design/icons';
import { menuList } from '@/routes'

export default {
  route: {
    path: '/',
    routes: menuList,
  },
  location: {
    pathname: '/',
  }
};